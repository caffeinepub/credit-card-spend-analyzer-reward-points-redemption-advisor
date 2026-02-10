import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
export interface RewardPoints {
    id: bigint;
    balance: bigint;
    options: Array<RedemptionOption>;
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
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getRewardProfiles(): Promise<Array<RewardPoints>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
