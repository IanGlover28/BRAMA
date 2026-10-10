export const DELIVERY_FEE = 10;

export interface PricedItem {
  price: number;
  quantity: number;
}

export function calcSubtotal(items: PricedItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calcTotal(subtotal: number, discountRate = 0): number {
  return parseFloat((subtotal * (1 - discountRate) + DELIVERY_FEE).toFixed(2));
}