import { useState, useEffect } from 'react';

const STORAGE_KEY = 'spendwise_advisory_settings';

export interface AdvisorySettings {
  lowValueThreshold: number; // CPP threshold below which to flag as low value
}

const DEFAULT_SETTINGS: AdvisorySettings = {
  lowValueThreshold: 1.0,
};

export function useRewardAdvisorySettings() {
  const [settings, setSettings] = useState<AdvisorySettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<AdvisorySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return {
    settings,
    updateSettings,
  };
}
