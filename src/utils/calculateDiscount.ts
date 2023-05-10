export const calculateDiscount = (basePrice: number, salePrice: number) => {
  const discount = (100 * salePrice) / basePrice;

  return discount.toFixed(0);
};
