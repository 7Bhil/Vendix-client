import React from 'react';

/**
 * Formatage standardisé des montants financiers avec chiffres tabulaires.
 */
export default function MoneyDisplay({
  amount = 0,
  currency = 'FCFA',
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  className = '',
  currencyClassName = '',
}) {
  const numericAmount = Number(amount) || 0;
  const formatted = numericAmount.toLocaleString('fr-FR');

  const sizeStyles = {
    sm: 'text-sm font-semibold',
    md: 'text-base font-bold',
    lg: 'text-xl font-extrabold',
    xl: 'text-3xl font-black tracking-tight',
  };

  const currencySizes = {
    sm: 'text-[10px] ml-1 font-normal opacity-70',
    md: 'text-xs ml-1 font-medium opacity-75',
    lg: 'text-sm ml-1.5 font-semibold opacity-80',
    xl: 'text-base ml-2 font-bold opacity-80',
  };

  return (
    <span className={`font-money inline-flex items-baseline ${sizeStyles[size] || sizeStyles.md} ${className}`}>
      <span>{formatted}</span>
      <span className={`${currencySizes[size] || currencySizes.md} ${currencyClassName}`}>{currency}</span>
    </span>
  );
}
