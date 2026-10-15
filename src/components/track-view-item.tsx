'use client';

import { useEffect } from "react";
import { trackViewItem, type AnalyticsProduct } from "@/lib/analytics";

/** Sends GA4 `view_item` once per product page view. Renders nothing. */
export default function TrackViewItem({ product }: { product: AnalyticsProduct }) {
  const { id, name, price, brand, category } = product;

  useEffect(() => {
    trackViewItem({ id, name, price, brand, category });
  }, [id, name, price, brand, category]);

  return null;
}
