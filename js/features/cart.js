import { products } from "../data/catalogue.js";
import { state } from "../core/state.js";
import { storage } from "../core/storage.js";
import { validQuantity, MAX_RETAIL_QUANTITY } from "../core/cart.js";
import { onAction } from "../core/events.js";
import { toast } from "../core/toast.js";

export function updateCartCount() {
  const count = state.cart.reduce((sum, line) => sum + line.quantity, 0);
  const badge = document.querySelector("#cart-count");
  if (badge) badge.textContent = count;
}
function saveCart() {
  const persisted = storage.set("cart", state.cart);
  updateCartCount();
  document.dispatchEvent?.(new Event("ath:cart-updated"));
  return persisted;
}
export function addToCart(productId, quantity = 1) {
  if (!products.some((p) => p.id === productId) || !validQuantity(quantity))
    return { ok: false };
  const existing = state.cart.find((line) => line.productId === productId);
  if ((existing?.quantity ?? 0) + quantity > MAX_RETAIL_QUANTITY)
    return { ok: false };
  if (existing) existing.quantity += quantity;
  else state.cart.push({ productId, quantity });
  return { ok: true, persisted: saveCart() };
}
export function setCartQuantity(productId, quantity) {
  const line = state.cart.find((item) => item.productId === productId);
  if (!line || !validQuantity(quantity)) return false;
  line.quantity = quantity;
  saveCart();
  return true;
}
export function removeFromCart(productId) {
  state.cart = state.cart.filter((line) => line.productId !== productId);
  saveCart();
}
export function clearCart() {
  state.cart = [];
  return saveCart();
}
export function initCart() {
  updateCartCount();
  onAction("[data-add-cart]", (button) => {
    const id = Number(button.dataset.addCart);
    const input = document.querySelector(`[data-retail-quantity="${id}"]`);
    const quantity = input ? Number(input.value) : 1;
    const result = addToCart(id, quantity);
    if (!result.ok) {
      toast(
        `Choose a whole quantity from 1 to ${MAX_RETAIL_QUANTITY}. Your cart can hold up to ${MAX_RETAIL_QUANTITY} of each product.`,
      );
      return;
    }
    toast(
      result.persisted
        ? "Added to cart. Open your cart to review your retail order."
        : "Cart updated on this page only. Browser storage is unavailable.",
    );
  });
}
