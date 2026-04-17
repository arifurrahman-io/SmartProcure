export const formatCurrency = (
  amount,
  { locale = "en-BD", currency = "BDT", fallback = "BDT 0" } = {},
) => {
  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) return fallback;

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(numericAmount);
  } catch {
    return `BDT ${numericAmount}`;
  }
};

export const formatCompactCurrency = (amount) => {
  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) return "BDT 0";

  if (numericAmount >= 10000000) {
    return `BDT ${(numericAmount / 10000000).toFixed(1)}Cr`;
  }

  if (numericAmount >= 100000) {
    return `BDT ${(numericAmount / 100000).toFixed(1)}L`;
  }

  if (numericAmount >= 1000) {
    return `BDT ${(numericAmount / 1000).toFixed(1)}K`;
  }

  return `BDT ${numericAmount}`;
};

export default formatCurrency;
