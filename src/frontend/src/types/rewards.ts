import type { RewardPoints, RedemptionOption } from '@/backend';

export type { RewardPoints, RedemptionOption };

export interface RedemptionOptionWithCPP extends RedemptionOption {
  cpp: number;
  netValue: number;
}

export interface RewardProfileWithCPP extends RewardPoints {
  optionsWithCPP: RedemptionOptionWithCPP[];
}
