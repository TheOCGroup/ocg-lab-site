import { UnderwritingInputs, UnderwritingOutputs, YearlyProjection } from '../types';

/**
 * Deterministic Financial Underwriting Engine
 * All calculations are executed strictly in pure TypeScript.
 */
export function calculateUnderwriting(inputs: UnderwritingInputs): UnderwritingOutputs {
  const {
    purchasePrice,
    rehabCost,
    monthlyRent,
    downPaymentPercent,
    interestRate,
    opExPercent
  } = inputs;

  const downPayment = purchasePrice * (downPaymentPercent / 100);
  const loanAmount = Math.max(0, purchasePrice - downPayment);
  const totalInvestment = downPayment + rehabCost;

  // Monthly Debt Service (30-year fixed loan)
  const monthlyRate = interestRate > 0 ? interestRate / 100 / 12 : 0;
  const numPayments = 360; // 30 Years

  let monthlyDebtService = 0;
  if (loanAmount > 0 && monthlyRate > 0) {
    const factor = Math.pow(1 + monthlyRate, numPayments);
    monthlyDebtService = loanAmount * (monthlyRate * factor) / (factor - 1);
  }

  const grossAnnualIncome = monthlyRent * 12;
  const annualOpEx = grossAnnualIncome * (opExPercent / 100);
  const netOperatingIncome = grossAnnualIncome - annualOpEx;
  const annualDebtService = monthlyDebtService * 12;
  const annualPreTaxCashFlow = netOperatingIncome - annualDebtService;

  const capRate = purchasePrice > 0 ? (netOperatingIncome / purchasePrice) * 100 : 0;
  const cashOnCashReturn = totalInvestment > 0 ? (annualPreTaxCashFlow / totalInvestment) * 100 : 0;
  const dscr = annualDebtService > 0 ? netOperatingIncome / annualDebtService : 99.9;

  // 10-Year Projections
  const multiYearProjections: YearlyProjection[] = [];
  let currentRent = monthlyRent;
  let currentOpExRate = opExPercent / 100;
  let cumulativeCash = 0;
  let currentPropertyValue = purchasePrice;

  for (let year = 1; year <= 10; year++) {
    if (year > 1) {
      currentRent *= 1.03; // 3% annual rent growth
      currentPropertyValue *= 1.035; // 3.5% property appreciation
    }

    const yearGross = currentRent * 12;
    const yearOpEx = yearGross * currentOpExRate;
    const yearNOI = yearGross - yearOpEx;
    const yearCashFlow = yearNOI - annualDebtService;
    cumulativeCash += yearCashFlow;

    multiYearProjections.push({
      year,
      noi: Math.round(yearNOI),
      annualCashFlow: Math.round(yearCashFlow),
      cumulativeCashFlow: Math.round(cumulativeCash),
      propertyValue: Math.round(currentPropertyValue),
    });
  }

  return {
    totalInvestment: Math.round(totalInvestment),
    loanAmount: Math.round(loanAmount),
    downPayment: Math.round(downPayment),
    monthlyDebtService: Math.round(monthlyDebtService),
    grossAnnualIncome: Math.round(grossAnnualIncome),
    annualOpEx: Math.round(annualOpEx),
    netOperatingIncome: Math.round(netOperatingIncome),
    annualPreTaxCashFlow: Math.round(annualPreTaxCashFlow),
    capRate: Number(capRate.toFixed(2)),
    cashOnCashReturn: Number(cashOnCashReturn.toFixed(2)),
    dscr: Number(dscr.toFixed(2)),
    multiYearProjections,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(percent: number): string {
  return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
}
