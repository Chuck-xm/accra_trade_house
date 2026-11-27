import { state } from "../core/state.js";
import { storage } from "../core/storage.js";
import { cartLines, cartSubtotal } from "../core/cart.js";
import { clearCart } from "./cart.js";

export function placeRetailOrder(details) {
  const lines = cartLines(state.cart);
  if (!lines.length)
    return {
      ok: false,
      error: "Your cart is empty. Add a product before checking out.",
    };
  if (
    !details.name?.trim() ||
    !details.email?.trim() ||
    !["Pickup", "Delivery request"].includes(details.fulfilment) ||
    (details.fulfilment === "Delivery request" && !details.address?.trim())
  ) {
    return {
      ok: false,
      error: "Complete your contact and collection or delivery details.",
    };
  }
  const order = {
    id: `ATH-R-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    type: "Retail order",
    created: new Date().toISOString(),
    data: {
      name: details.name.trim().slice(0, 200),
      email: details.email.trim().slice(0, 200),
      phone: (details.phone ?? "").trim().slice(0, 200),
      fulfilment: details.fulfilment,
      address:
        details.fulfilment === "Delivery request"
          ? details.address.trim().slice(0, 1000)
          : "",
      notes: (details.notes ?? "").trim().slice(0, 1000),
      product: `${lines.reduce((sum, line) => sum + line.quantity, 0)} retail items`,
      items: lines.map(({ product, quantity, totalCents }) => ({
        productId: product.id,
        name: product.name,
        unit: product.unit,
        quantity,
        unitPrice: product.price,
        lineTotal: totalCents / 100,
      })),
      subtotal: cartSubtotal(state.cart),
      currency: "GHS",
      status: "Demo only — not sent or paid",
    },
  };
  const records = [...state.records, order];
  if (!storage.set("records", records))
    return {
      ok: false,
      error:
        "Unable to save the demo order. Your cart has been kept on this page.",
    };
  state.records = records;
  clearCart();
  return { ok: true, order };
}
