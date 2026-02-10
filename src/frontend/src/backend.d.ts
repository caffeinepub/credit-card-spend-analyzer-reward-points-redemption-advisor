import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface RewardPoints {
    id: bigint;
    balance: bigint;
    options: Array<RedemptionOption>;
}
export interface RedemptionOption {
    id: bigint;
    pointsRequired: bigint;
    restrictions: string;
    fees: number;
    cashValue: number;
    type: Variant_other_statementCredit_travelPortal_giftCard_transferToPartner;
}
export interface UserProfile {
    name: string;
}
export interface Transaction {
    id: bigint;
    date: string;
    currency: Currency;
    merchant: string;
    notes: string;
    category: string;
    cardLabel: string;
    amount: number;
    rawDescription: string;
}
export enum Currency {
    BTC = "BTC",
    ETH = "ETH",
    EUR = "EUR",
    ICP = "ICP",
    RUB = "RUB",
    USD = "USD",
    XMR = "XMR",
    FIAT = "FIAT"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_other_statementCredit_travelPortal_giftCard_transferToPartner {
    other = "other",
    statementCredit = "statementCredit",
    travelPortal = "travelPortal",
    giftCard = "giftCard",
    transferToPartner = "transferToPartner"
}
export interface backendInterface {
    addRedemptionOption(rewardId: bigint, newOption: RedemptionOption): Promise<bigint>;
    addRewardProfile(balance: bigint, options: Array<RedemptionOption>): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bulkImportTransactions(transactions: Array<Transaction>): Promise<void>;
    createTransaction(date: string, merchant: string, amount: number, currency: Currency, category: string, cardLabel: string, notes: string, rawDescription: string): Promise<bigint>;
    deleteTransaction(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getRewardProfiles(): Promise<Array<RewardPoints>>;
    getTransactions(): Promise<Array<Transaction>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateTransaction(id: bigint, updatedTransaction: Transaction): Promise<void>;
}
