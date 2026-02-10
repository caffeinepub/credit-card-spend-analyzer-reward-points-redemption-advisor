import type { RedemptionOption } from '@/backend';
import { computeCPP, computeNetValue } from './rewardsMath';

export interface RankedOption {
  option: RedemptionOption;
  cpp: number;
  netValue: number;
  explanation: string;
  isLowValue: boolean;
}

export function rankRedemptionOptions(
  options: RedemptionOption[],
  lowValueThreshold: number
): RankedOption[] {
  const ranked = options.map((option) => {
    const cpp = computeCPP(option.cashValue, option.fees, Number(option.pointsRequired));
    const netValue = computeNetValue(option.cashValue, option.fees);

    let explanation = '';
    if (cpp >= 2.0) {
      explanation = 'Excellent value - significantly better than typical redemptions.';
    } else if (cpp >= 1.5) {
      explanation = 'Good value - above average redemption rate.';
    } else if (cpp >= 1.0) {
      explanation = 'Decent value - typical for statement credits.';
    } else {
      explanation = 'Below average value - consider other redemption options.';
    }

    if (option.fees > 0) {
      explanation += ` Note: ${option.fees > 0 ? `$${option.fees.toFixed(2)} in fees reduces net value.` : ''}`;
    }

    return {
      option,
      cpp,
      netValue,
      explanation,
      isLowValue: cpp < lowValueThreshold,
    };
  });

  return ranked.sort((a, b) => b.cpp - a.cpp);
}
