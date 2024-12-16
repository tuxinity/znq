export const formatPrice = (price: number | null) => {
  if (price === null) return "-.--";
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(price);
};
