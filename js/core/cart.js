import { products } from "../data/catalogue.js";

export const MAX_RETAIL_QUANTITY = 99;
export const validQuantity = (value) =>
  Number.isInteger(value) && value >= 1 && value <= MAX_RETAIL_QUANTITY;

// Store IDs and quantities only; prices always come from the current catalogue.
export function normalizeCart(value) {
  if (!Array.isArray(value)) return [];
  const quantities = new Map();
  for (const line of value) {
    if (
      !line ||
      !products.some((p) => p.id === line.productId) ||
      !Number.isInteger(line.quantity) ||
      line.quantity < 1
    )
      continue;
    quantities.set(
      line.productId,
      Math.min(
        MAX_RETAIL_QUANTITY,
        (quantities.get(line.productId) ?? 0) + line.quantity,
      ),
    );
  }
  return [...quantities].map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
}

export function cartLines(cart) {
  return normalizeCart(cart).map((line) => {
    const product = products.find((p) => p.id === line.productId);
    return {
      ...line,
      product,
      totalCents: Math.round(product.price * 100) * line.quantity,
    };
  });
}
export const cartSubtotal = (cart) =>
  cartLines(cart).reduce((sum, line) => sum + line.totalCents, 0) / 100;
