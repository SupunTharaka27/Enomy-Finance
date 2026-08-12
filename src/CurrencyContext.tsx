/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, ReactNode } from 'react';

export type CurrencyCode = 'USD' | 'GBP' | 'EUR' | 'BRL' | 'JPY' | 'TRY';

export interface CurrencyInfo {
  code: CurrencyCode;
  name: string;
  symbol: string;
  rateToUSD: number; // 1 USD = X Currency
  flag: string;
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', rateToUSD: 1.0, flag: '🇺🇸' },
  GBP: { code: 'GBP', name: 'Pound Sterling', symbol: '£', rateToUSD: 0.785, flag: '🇬🇧' },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', rateToUSD: 0.922, flag: '🇪🇺' },
  BRL: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rateToUSD: 5.65, flag: '🇧🇷' },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rateToUSD: 154.20, flag: '🇯🇵' },
  TRY: { code: 'TRY', name: 'Turkish Lira', symbol: '₺', rateToUSD: 32.85, flag: '🇹🇷' },
};

interface CurrencyContextType {
  currency: CurrencyCode;
  currencySymbol: string;
  currencyLabel: string;
  setCurrency: (code: CurrencyCode) => void;
  formatCurrency: (amount: number, options?: { compact?: boolean; decimals?: number; code?: CurrencyCode }) => string;
  convertCurrency: (amount: number, from: CurrencyCode, to: CurrencyCode) => number;
  getExchangeRate: (from: CurrencyCode, to: CurrencyCode) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('currency') as CurrencyCode;
    return SUPPORTED_CURRENCIES[saved] ? saved : 'USD';
  });

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem('currency', code);
  };

  const activeInfo = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.USD;
  const currencySymbol = activeInfo.symbol;
  const currencyLabel = `${activeInfo.name} (${activeInfo.symbol})`;

  const convertCurrency = (amount: number, from: CurrencyCode, to: CurrencyCode): number => {
    if (from === to) return amount;
    const fromRate = SUPPORTED_CURRENCIES[from]?.rateToUSD || 1.0;
    const toRate = SUPPORTED_CURRENCIES[to]?.rateToUSD || 1.0;
    // convert from -> USD -> to
    const amountInUSD = amount / fromRate;
    return amountInUSD * toRate;
  };

  const getExchangeRate = (from: CurrencyCode, to: CurrencyCode): number => {
    return convertCurrency(1, from, to);
  };

  const formatCurrency = (amount: number, options?: { compact?: boolean; decimals?: number; code?: CurrencyCode }) => {
    const targetCode = options?.code || currency;
    const info = SUPPORTED_CURRENCIES[targetCode] || SUPPORTED_CURRENCIES.USD;
    const defaultDecimals = targetCode === 'JPY' ? 0 : 2;
    const decimals = options?.decimals !== undefined ? options.decimals : defaultDecimals;

    if (options?.compact) {
      if (amount >= 1000000) {
        return `${info.symbol}${(amount / 1000000).toFixed(1)}M`;
      }
      if (amount >= 1000) {
        return `${info.symbol}${(amount / 1000).toFixed(0)}k`;
      }
    }
    return `${info.symbol}${amount.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencySymbol,
        currencyLabel,
        setCurrency,
        formatCurrency,
        convertCurrency,
        getExchangeRate,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
