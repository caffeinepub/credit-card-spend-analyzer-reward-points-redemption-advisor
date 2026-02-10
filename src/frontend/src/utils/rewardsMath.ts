export function computeCPP(cashValue: number, fees: number, pointsRequired: number): number {
  if (pointsRequired === 0) return 0;
  const netValue = cashValue - fees;
  return (netValue / pointsRequired) * 100;
}

export function computeNetValue(cashValue: number, fees: number): number {
  return cashValue - fees;
}

export function formatCPP(cpp: number): string {
  return cpp.toFixed(2) + '¢';
}
