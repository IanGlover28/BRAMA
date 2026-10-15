/**
 * GA4 e-commerce events. Every helper no-ops when GA isn't configured
 * (NEXT_PUBLIC_GA_ID unset) or gtag never loads (ad blocker), and on the server.
 * https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const CURRENCY = "GHS";

const GA_ENABLED = Boolean(process.env.NEXT_PUBLIC_GA_ID);
// gtag is defined by an afterInteractive script, so early events wait for it.
const GTAG_RETRY_MS = 250;
const GTAG_MAX_RETRIES = 40;

/** Anything with the fields we report; cart items, products and order items all fit. */
export interface AnalyticsProduct {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  brand?: string | null;
  category?: string | null;
}

export interface Ga4Item {
  item_id: string;
  item_name: string;
  item_brand?: string;
  item_category?: string;
  price: number;
  quantity: number;
}

export function toGa4Item(p: AnalyticsProduct, quantity = p.quantity ?? 1): Ga4Item {
  return {
    item_id: p.id,
    item_name: p.name,
    ...(p.brand && { item_brand: p.brand }),
    ...(p.category && { item_category: p.category }),
    price: p.price,
    quantity,
  };
}

function itemsValue(items: Ga4Item[]) {
  return parseFloat(items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2));
}

function canTrack() {
  return GA_ENABLED && typeof window !== "undefined";
}

function sendEvent(name: string, params: Record<string, unknown>, attempt = 0) {
  if (!canTrack()) return;
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  } else if (attempt < GTAG_MAX_RETRIES) {
    setTimeout(() => sendEvent(name, params, attempt + 1), GTAG_RETRY_MS);
  }
}

function sendItemsEvent(name: string, items: Ga4Item[], extra: Record<string, unknown> = {}) {
  if (items.length === 0) return;
  sendEvent(name, { currency: CURRENCY, value: itemsValue(items), items, ...extra });
}

export function trackViewItem(product: AnalyticsProduct) {
  sendItemsEvent("view_item", [toGa4Item(product, 1)]);
}

export function trackAddToCart(product: AnalyticsProduct, quantity: number) {
  if (quantity > 0) sendItemsEvent("add_to_cart", [toGa4Item(product, quantity)]);
}

export function trackRemoveFromCart(product: AnalyticsProduct, quantity: number) {
  if (quantity > 0) sendItemsEvent("remove_from_cart", [toGa4Item(product, quantity)]);
}

export function trackBeginCheckout(
  products: AnalyticsProduct[],
  opts: { value: number; coupon?: string }
) {
  sendItemsEvent("begin_checkout", products.map((p) => toGa4Item(p)), {
    value: opts.value,
    ...(opts.coupon && { coupon: opts.coupon }),
  });
}

/**
 * Sends `purchase` at most once per transaction_id in this browser, so
 * reloading the success page doesn't double-count revenue.
 */
export function trackPurchase(order: {
  transactionId: string;
  value: number;
  shipping?: number;
  items: AnalyticsProduct[];
}) {
  if (!canTrack()) return;

  const key = `ga4_purchase_${order.transactionId}`;
  try {
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, "1");
  } catch {
    // Storage blocked; still report, GA dedupes on transaction_id within a session.
  }

  sendItemsEvent("purchase", order.items.map((p) => toGa4Item(p)), {
    transaction_id: order.transactionId,
    value: order.value,
    ...(order.shipping !== undefined && { shipping: order.shipping }),
  });
}
