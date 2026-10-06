export const DELIVERY_FEE = 10;

export const PROMO_CODES: Record<string, number> = {
  highhub10: 0.1,
};

export interface PricedItem {
  price: number;
  quantity: number;
}

export function calcSubtotal(items: PricedItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getDiscountRate(promoCode?: string): number {
  if (!promoCode) return 0;
  return PROMO_CODES[promoCode.trim().toLowerCase()] ?? 0;
}

export function calcTotal(subtotal: number, promoCode?: string): number {
  const rate = getDiscountRate(promoCode);
  return parseFloat((subtotal * (1 - rate) + DELIVERY_FEE).toFixed(2));
}
