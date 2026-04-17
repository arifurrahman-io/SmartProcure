export const getApprovedQuotation = (quotations = []) => {
  return quotations.find((item) => item.isApproved) || null;
};

export const getLowestQuotation = (quotations = []) => {
  if (!quotations.length) return null;

  const normalized = quotations.map((item) => ({
    ...item,
    numericAmount: Number(String(item.amount).replace(/[^0-9.]/g, "")) || 0,
  }));

  return (
    normalized.sort((a, b) => a.numericAmount - b.numericAmount)[0] || null
  );
};

export const sortQuotationsByAmountAsc = (quotations = []) => {
  return [...quotations].sort((a, b) => {
    const amountA = Number(String(a.amount).replace(/[^0-9.]/g, "")) || 0;
    const amountB = Number(String(b.amount).replace(/[^0-9.]/g, "")) || 0;
    return amountA - amountB;
  });
};

export default {
  getApprovedQuotation,
  getLowestQuotation,
  sortQuotationsByAmountAsc,
};
