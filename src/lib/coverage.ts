export interface CoverageInputs {
  monthlyIncome: number;
  yearsSupport: number;
  debts: number;
  specialExpenses: number;
  savings: number;
  existingCover: number;
}

export interface CoverageResult {
  incomeReplacement: number;
  grossNeed: number;
  deductions: number;
  gap: number;
}

export function calculateCoverage({
  monthlyIncome,
  yearsSupport,
  debts,
  specialExpenses,
  savings,
  existingCover,
}: CoverageInputs): CoverageResult {
  const incomeReplacement = monthlyIncome * 12 * yearsSupport;
  const grossNeed = incomeReplacement + debts + specialExpenses;
  const deductions = savings + existingCover;
  const gap = Math.max(0, grossNeed - deductions);

  return { incomeReplacement, grossNeed, deductions, gap };
}

export { rm } from './ncd';
