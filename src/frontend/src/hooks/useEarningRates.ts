import { useState, useEffect } from 'react';
import type { EarningRates } from '@/types/earningRates';

const STORAGE_KEY = 'spendwise_earning_rates';

const DEFAULT_RATES: EarningRates = {
  categoryRates: {
    Dining: 1,
    Travel: 1,
    Groceries: 1,
    Gas: 1,
    Entertainment: 1,
    Shopping: 1,
    Other: 1,
  },
  cardOverrides: {},
};

export function useEarningRates() {
  const [rates, setRates] = useState<EarningRates>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_RATES;
    } catch {
      return DEFAULT_RATES;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rates));
  }, [rates]);

  const updateCategoryRate = (category: string, rate: number) => {
    setRates((prev) => ({
      ...prev,
      categoryRates: {
        ...prev.categoryRates,
        [category]: rate,
      },
    }));
  };

  const updateCardOverride = (cardLabel: string, category: string, rate: number) => {
    setRates((prev) => ({
      ...prev,
      cardOverrides: {
        ...prev.cardOverrides,
        [cardLabel]: {
          ...prev.cardOverrides[cardLabel],
          [category]: rate,
        },
      },
    }));
  };

  const removeCardOverride = (cardLabel: string, category: string) => {
    setRates((prev) => {
      const newOverrides = { ...prev.cardOverrides };
      if (newOverrides[cardLabel]) {
        const { [category]: _, ...rest } = newOverrides[cardLabel];
        if (Object.keys(rest).length === 0) {
          delete newOverrides[cardLabel];
        } else {
          newOverrides[cardLabel] = rest;
        }
      }
      return {
        ...prev,
        cardOverrides: newOverrides,
      };
    });
  };

  return {
    rates,
    updateCategoryRate,
    updateCardOverride,
    removeCardOverride,
  };
}
