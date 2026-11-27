import { state } from "../core/state.js";
import { cartLines, cartSubtotal } from "../core/cart.js";
import { money, photo, escapeHTML as e } from "../core/utils.js";
import { onAction } from "../core/events.js";
import { toast } from "../core/toast.js";
import { productUrl } from "./product-details.js";
import { setCartQuantity, removeFromCart } from "./cart.js";
import { placeRetailOrder } from "./retail-orders.js";

export function renderCart() {
  document.querySelector("#cart-success").hidden = true;
  const lines = cartLines(state.cart);
  document.querySelector("#cart-empty").hidden = lines.length > 0;
  document.querySelector("#cart-layout").hidden = lines.length === 0;
  document.querySelector("#cart-lines").innerHTML = lines
    .map(
      ({ product: p, quantity, totalCents }) =>
        /* HTML */ ` <article class="cart-line">
          <a href="${productUrl(p.id)}" class="cart-line-photo"
            ><img src="${photo(p.image)}" alt="${e(p.name)}"
          /></a>
          <div class="cart-line-information">
            <a class="cart-line-title" href="${productUrl(p.id)}"
              >${e(p.name)}</a
            >
            <p>${e(p.producer)}</p>
            <p>${money(p.price)} / ${e(p.unit)}</p>
            <div class="cart-line-controls">
              <div class="cart-quantity-control">
                <button
                  type="button"
                  data-cart-step="${p.id}"
                  data-step="-1"
                  aria-label="Decrease quantity of ${e(p.name)}"
                  ${quantity === 1 ? "disabled" : ""}
                >
                  −
                </button>
                <label class="sr-only" for="cart-quantity-${p.id}"
                  >Quantity of ${e(p.name)}</label
                >
                <input
                  id="cart-quantity-${p.id}"
                  data-cart-quantity="${p.id}"
                  type="number"
                  inputmode="numeric"
                  min="1"
                  max="99"
                  step="1"
                  value="${quantity}"
                />
                <button
                  type="button"
                  data-cart-step="${p.id}"
                  data-step="1"
                  aria-label="Increase quantity of ${e(p.name)}"
                  ${quantity === 99 ? "disabled" : ""}
                >
                  +
                </button>
              </div>
              <button
                type="button"
                class="cart-remove"
                data-cart-remove="${p.id}"
                aria-label="Remove ${e(p.name)} from cart"
              >
                Remove
              </button>
            </div>
          </div>
          <strong class="cart-line-total">${money(totalCents / 100)}</strong>
        </article>`,
    )
    .join("");
  document.querySelector("#cart-subtotal").textContent = money(
    cartSubtotal(state.cart),
  );
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  document.querySelector("#cart-item-summary").textContent =
    `${count} ${count === 1 ? "item" : "items"} · ${lines.length} ${lines.length === 1 ? "product" : "products"}`;
}

export function initCartPage() {
  renderCart();
  document.addEventListener("ath:cart-updated", renderCart);
  onAction("[data-cart-step]", (button) => {
    const id = Number(button.dataset.cartStep);
    const line = state.cart.find((item) => item.productId === id);
    if (line) setCartQuantity(id, line.quantity + Number(button.dataset.step));
    document.querySelector(`#cart-quantity-${id}`)?.focus();
  });
  onAction("[data-cart-remove]", (button) => {
    removeFromCart(Number(button.dataset.cartRemove));
    document
      .querySelector(
        state.cart.length ? "[data-cart-quantity]" : "#cart-empty a",
      )
      ?.focus();
  });
  document.querySelector("#cart-lines").addEventListener("change", (event) => {
    const input = event.target.closest("[data-cart-quantity]");
    if (!input) return;
    const id = Number(input.dataset.cartQuantity);
    if (!setCartQuantity(id, Number(input.value))) {
      toast("Enter a whole quantity between 1 and 99.");
      renderCart();
    }
    document.querySelector(`#cart-quantity-${id}`)?.focus();
  });
  const checkout = document.querySelector("#retail-checkout");
  const fulfilment = checkout.querySelector('[name="fulfilment"]');
  function updateDelivery() {
    const delivery = fulfilment.value === "Delivery request";
    document.querySelector("#cart-delivery-field").hidden = !delivery;
    checkout.querySelector('[name="address"]').required = delivery;
  }
  fulfilment.addEventListener("change", updateDelivery);
  updateDelivery();
  checkout.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!checkout.reportValidity()) return;
    const result = placeRetailOrder(Object.fromEntries(new FormData(checkout)));
    if (!result.ok) {
      toast(result.error);
      return;
    }
    document.querySelector("#cart-empty").hidden = true;
    const success = document.querySelector("#cart-success");
    success.innerHTML = /* HTML */ `<span class="eyebrow muted"
        >SAVED IN THIS BROWSER</span
      >
      <h2>Your demo retail order is saved.</h2>
      <p>Reference: <strong>${e(result.order.id)}</strong></p>
      <p>
        This order has not been sent to ATH or paid. It is a local prototype
        record for review.
      </p>
      <ul>
        ${result.order.data.items.map((item) => `<li>${e(item.name)} × ${item.quantity} — ${money(item.lineTotal)}</li>`).join("")}
      </ul>
      <p>
        Product subtotal: <strong>${money(result.order.data.subtotal)}</strong>
      </p>
      <div class="cart-success-actions">
        <button type="button" class="button dark" id="success-desk">
          View my trade desk</button
        ><a class="button outline" href="index.html#collections"
          >Continue shopping</a
        >
      </div>`;
    success.hidden = false;
    success.focus();
  });
}
