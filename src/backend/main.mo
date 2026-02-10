import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Currency = {
    #USD;
    #EUR;
    #BTC;
    #ICP;
    #ETH;
    #FIAT;
    #XMR;
    #RUB;
  };

  public type RedemptionOption = {
    id : Nat;
    type_ : {
      #statementCredit;
      #travelPortal;
      #transferToPartner;
      #giftCard;
      #other;
    };
    pointsRequired : Nat;
    cashValue : Float;
    fees : Float;
    restrictions : Text;
  };

  type RewardPoints = {
    id : Nat;
    balance : Nat;
    options : [RedemptionOption];
  };

  public type UserProfile = {
    name : Text;
  };

  type Transaction = {
    id : Nat;
    date : Text;
    merchant : Text;
    amount : Float;
    currency : Currency;
    category : Text;
    cardLabel : Text;
    notes : Text;
    rawDescription : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let rewardProfiles = Map.empty<Principal, [RewardPoints]>();
  let transactionsByUser = Map.empty<Principal, List.List<Transaction>>();
  var nextTransactionId = 0;
  var nextRewardId = 0;
  var nextOptionId = 0;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Reward Points Management
  public shared ({ caller }) func addRewardProfile(balance : Nat, options : [RedemptionOption]) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add reward profiles");
    };

    let rewardId = nextRewardId;
    nextRewardId += 1;

    let newRewardPoint : RewardPoints = {
      id = rewardId;
      balance;
      options;
    };

    let existingRewards = switch (rewardProfiles.get(caller)) {
      case (null) { [] };
      case (?rewards) { rewards };
    };

    rewardProfiles.add(caller, existingRewards.concat([newRewardPoint]));
    rewardId;
  };

  public shared ({ caller }) func addRedemptionOption(rewardId : Nat, newOption : RedemptionOption) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add redemption options");
    };

    let updatedRewards = switch (rewardProfiles.get(caller)) {
      case (null) {
        [];
      };
      case (?rewards) {
        rewards.map(
          func(rp) {
            if (rp.id == rewardId) {
              let newOptionId = nextOptionId;
              nextOptionId += 1;

              let updatedOption = {
                newOption with id = newOptionId;
              };
              let updatedReward = {
                rp with options = rp.options.concat([updatedOption]);
              };
              updatedReward;
            } else {
              rp;
            };
          }
        );
      };
    };

    rewardProfiles.add(caller, updatedRewards);
    nextOptionId - 1 : Nat;
  };

  public query ({ caller }) func getRewardProfiles() : async [RewardPoints] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view reward profiles");
    };
    switch (rewardProfiles.get(caller)) {
      case (null) { [] };
      case (?result) { result };
    };
  };

  // Transactions CRUD
  public shared ({ caller }) func createTransaction(date : Text, merchant : Text, amount : Float, currency : Currency, category : Text, cardLabel : Text, notes : Text, rawDescription : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create transactions");
    };

    let transactionId = nextTransactionId;
    nextTransactionId += 1;

    let newTransaction : Transaction = {
      id = transactionId;
      date;
      merchant;
      amount;
      currency;
      category;
      cardLabel;
      notes;
      rawDescription;
    };

    let userTransactions = switch (transactionsByUser.get(caller)) {
      case (null) { List.empty<Transaction>() };
      case (?transactions) { transactions };
    };

    userTransactions.add(newTransaction);
    transactionsByUser.add(caller, userTransactions);
    transactionId;
  };

  public query ({ caller }) func getTransactions() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view transactions");
    };
    let transactions = switch (transactionsByUser.get(caller)) {
      case (null) { List.empty<Transaction>() };
      case (?t) { t };
    };
    transactions.toArray();
  };

  public shared ({ caller }) func updateTransaction(id : Nat, updatedTransaction : Transaction) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update transactions");
    };

    let userTransactions = switch (transactionsByUser.get(caller)) {
      case (null) { List.empty<Transaction>() };
      case (?transactions) { transactions };
    };

    let updatedList = userTransactions.map<Transaction, Transaction>(
      func(tr) {
        if (tr.id == id) {
          updatedTransaction;
        } else {
          tr;
        };
      }
    );

    transactionsByUser.add(caller, updatedList);
  };

  public shared ({ caller }) func deleteTransaction(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete transactions");
    };

    let userTransactions = switch (transactionsByUser.get(caller)) {
      case (null) { List.empty<Transaction>() };
      case (?transactions) { transactions };
    };

    let filteredList = userTransactions.filter(
      func(transaction) {
        transaction.id != id;
      }
    );

    transactionsByUser.add(caller, filteredList);
  };

  public shared ({ caller }) func bulkImportTransactions(transactions : [Transaction]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can import transactions");
    };

    let userTransactions = switch (transactionsByUser.get(caller)) {
      case (null) { List.empty<Transaction>() };
      case (?transactions) { transactions };
    };

    let transactionsList = List.fromArray<Transaction>(transactions);
    userTransactions.addAll(transactionsList.values());
    transactionsByUser.add(caller, userTransactions);
  };
};
