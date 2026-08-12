/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Review Required' | 'Pending Approval' | 'Closed';
  annualIncome: number;
  creditScore: number;
  mortgageBalance?: number;
  savingsBalance: number;
  investmentBalance: number;
  riskProfile: 'Low' | 'Medium' | 'High' | 'Unassessed';
  joinedDate: string;
}

export interface MortgageQuote {
  loanAmount: number;
  deposit: number;
  propertyValue: number;
  termYears: number;
  interestRate: number;
  monthlyRepayment: number;
  totalInterestPaid: number;
  totalAmountPaid: number;
  loanToValueRatio: number;
  productType: string;
}

export interface SavingsQuote {
  initialAmount: number;
  monthlyDeposit: number;
  years: number;
  interestRate: number;
  totalPrincipal: number;
  totalInterest: number;
  totalValue: number;
  productType: string;
}

export interface InvestmentProfile {
  riskScore: number;
  riskCategory: 'Low' | 'Medium' | 'High';
  assetAllocation: {
    stocks: number;
    bonds: number;
    cash: number;
    alternatives: number;
  };
  recommendedPortfolioName: string;
  expectedAnnualReturn: number;
}

export interface DataDictionaryEntry {
  tableName: string;
  fieldName: string;
  dataType: string;
  length: string;
  keyType: 'PK' | 'FK' | 'None';
  isRequired: boolean;
  description: string;
  constraints: string;
  sampleValue: string;
}

export interface FeedbackItem {
  id: string;
  reviewer: string;
  role: string;
  feedback: string;
  actionTaken: string;
  date: string;
  status: 'Approved' | 'Resolved' | 'Pending';
}

export interface TestCase {
  id: string;
  category: 'Mortgage' | 'Savings' | 'Investments' | 'System' | 'Forex';
  description: string;
  inputs: string;
  expectedResult: string;
  actualResult: string;
  status: 'Untested' | 'Pass' | 'Fail';
}
