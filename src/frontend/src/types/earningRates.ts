export interface EarningRates {
  categoryRates: Record<string, number>; // category -> points per dollar
  cardOverrides: Record<string, Record<string, number>>; // cardLabel -> category -> points per dollar
}

export interface PointsEstimate {
  byCategory: Record<string, number>;
  total: number;
}
