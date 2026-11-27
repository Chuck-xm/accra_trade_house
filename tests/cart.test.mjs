import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeCart, cartLines, cartSubtotal } from "../js/core/cart.js";

const memory = new Map([
  ["ath-cart", JSON.stringify([{ productId: 1, quantity: 1 }])],
]);
let blockRecords = false;
const elements = new Map();
const listeners = new Map();
function element(key) {
  if (!elements.has(key))
    elements.set(key, {
      innerHTML: "",
      textContent: "",
      hidden: false,
      open: false,
      required: false,
      value: key.endsWith('[name="fulfilment"]') ? "Pickup" : "",
      attributes: {},
      dataset: {},
      listeners: {},
      classList: { add() {}, remove() {}, toggle() {} },
      setAttribute(name, value) {
        this.attributes[name] = value;
      },
      addEventListener(type, callback) {
        (this.listeners[type] ??= []).push(callback);
      },
      querySelector(selector) {
        return element(`${key} ${selector}`);
      },
      focus() {},
      showModal() {
        this.open = true;
      },
      close() {
        this.open = false;
      },
      reportValidity() {
        return true;
      },
    });
  return elements.get(key);
}
globalThis.document = {
  querySelector: (selector) =>
    selector === "#product-grid" ? null : element(selector),
  querySelectorAll: () => [],
  addEventListener(type, callback) {
    (listeners.get(type) ?? listeners.set(type, []).get(type)).push(callback);
  },
  dispatchEvent(event) {
    for (const callback of listeners.get(event.type) ?? []) callback(event);
  },
};
globalThis.localStorage = {
  getItem: (key) => memory.get(key) ?? null,
  setItem(key, value) {
    if (blockRecords && key === "ath-records")
      throw new Error("Storage unavailable");
    memory.set(key, value);
  },
};
globalThis.FormData = class {
  constructor(form) {
    return Object.entries(form.values);
  }
};
function click(dataset = {}, id = "") {
  const target = {
    dataset,
    closest(selector) {
      if (selector === `#${id}`) return this;
      const key = selector
        .match(/^\[data-([a-z-]+)\]$/)?.[1]
        ?.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      return key && key in dataset ? this : null;
    },
  };
  for (const callback of listeners.get("click") ?? []) callback({ target });
}
function emit(key, type, event = {}) {
  for (const callback of element(key).listeners[type] ?? []) callback(event);
}
await import("../cart.js");
const { state } = await import("../js/core/state.js");
const { addToCart, setCartQuantity, removeFromCart, clearCart } =
  await import("../js/features/cart.js");
const { placeRetailOrder } = await import("../js/features/retail-orders.js");

await test("stored cart data is validated, merged and priced from the catalogue", () => {
  assert.deepEqual(normalizeCart(null), []);
  assert.deepEqual(
    normalizeCart([
      null,
      { productId: 999, quantity: 1 },
      { productId: 1, quantity: -1 },
      { productId: 1, quantity: 1.5 },
    ]),
    [],
  );
  assert.deepEqual(
    normalizeCart([
      { productId: 1, quantity: 80 },
      { productId: 1, quantity: 30 },
    ]),
    [{ productId: 1, quantity: 99 }],
  );
  assert.equal(
    cartLines([{ productId: 1, quantity: 2, price: 0.01 }])[0].product.price,
    65,
  );
  assert.equal(
    cartSubtotal([
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 1 },
    ]),
    410,
  );
});

await test("retail starts at one unit and cart quantities survive reload data", () => {
  assert.deepEqual(state.cart, [{ productId: 1, quantity: 1 }]);
  assert.equal(element("#cart-count").textContent, 1);
  assert.equal(addToCart(1, 2).ok, true);
  assert.equal(state.cart[0].quantity, 3);
  assert.equal(element("#cart-subtotal").textContent, "GH₵ 195.00");
  assert.deepEqual(
    normalizeCart(JSON.parse(memory.get("ath-cart"))),
    state.cart,
  );
  assert.equal(addToCart(999, 1).ok, false);
  assert.equal(addToCart(1, 97).ok, false);
  assert.equal(setCartQuantity(1, 0), false);
  assert.equal(setCartQuantity(1, 1.5), false);
  assert.equal(state.cart[0].quantity, 3);
});

await test("cart controls update totals and removing the last item shows the empty state", () => {
  click({ cartStep: "1", step: "1" });
  assert.equal(state.cart[0].quantity, 4);
  const input = element("#cart-quantity-1");
  input.dataset.cartQuantity = "1";
  input.value = "2";
  input.closest = () => input;
  emit("#cart-lines", "change", { target: input });
  assert.equal(state.cart[0].quantity, 2);
  input.value = "-5";
  emit("#cart-lines", "change", { target: input });
  assert.equal(state.cart[0].quantity, 2);
  click({ cartRemove: "1" });
  assert.equal(element("#cart-empty").hidden, false);
  assert.equal(element("#cart-layout").hidden, true);
  assert.equal(element("#cart-count").textContent, 0);
});

await test("delivery requires an address and changing quantities preserves checkout input", () => {
  addToCart(2, 1);
  const fulfilment = element('#retail-checkout [name="fulfilment"]');
  fulfilment.value = "Delivery request";
  emit('#retail-checkout [name="fulfilment"]', "change");
  assert.equal(element("#cart-delivery-field").hidden, false);
  assert.equal(element('#retail-checkout [name="address"]').required, true);
  assert.equal(
    placeRetailOrder({
      name: "Demo",
      email: "demo@example.com",
      fulfilment: "Delivery request",
      address: "",
    }).ok,
    false,
  );
  const name = element('#retail-checkout [name="name"]');
  name.value = "Keep this name";
  setCartQuantity(2, 2);
  assert.equal(name.value, "Keep this name");
  fulfilment.value = "Pickup";
  emit('#retail-checkout [name="fulfilment"]', "change");
  assert.equal(element('#retail-checkout [name="address"]').required, false);
});

await test("demo checkout saves canonical order lines, clears the cart, and appears in the trade desk", () => {
  const form = element("#retail-checkout");
  form.values = {
    name: "Demo buyer",
    email: "demo@example.com",
    fulfilment: "Pickup",
    address: "not needed",
    notes: "Demo only",
  };
  emit("#retail-checkout", "submit", { preventDefault() {} });
  const order = JSON.parse(memory.get("ath-records"))[0];
  assert.equal(order.type, "Retail order");
  assert.equal(order.data.items[0].quantity, 2);
  assert.equal(order.data.items[0].unitPrice, 280);
  assert.equal(order.data.subtotal, 560);
  assert.equal(order.data.address, "");
  assert.equal(order.data.status, "Demo only — not sent or paid");
  assert.deepEqual(JSON.parse(memory.get("ath-cart")), []);
  assert.equal(element("#cart-success").hidden, false);
  assert.match(
    element("#cart-success").innerHTML,
    /has not been sent to ATH or paid/,
  );
  click({}, "success-desk");
  assert.match(element("#modal-content").innerHTML, /Retail order/);
  assert.match(element("#modal-content").innerHTML, /Handwoven Bolga basket/);
  emit("#retail-checkout", "submit", { preventDefault() {} });
  assert.equal(state.records.length, 1);
});

await test("a failed order save keeps the cart, and privacy clearing removes cart data", () => {
  addToCart(1, 1);
  blockRecords = true;
  const result = placeRetailOrder({
    name: "Demo",
    email: "demo@example.com",
    fulfilment: "Pickup",
  });
  assert.equal(result.ok, false);
  assert.equal(state.cart.length, 1);
  assert.equal(state.records.length, 1);
  blockRecords = false;
  click({}, "clear-demo-data");
  assert.deepEqual(state.cart, []);
  assert.deepEqual(state.records, []);
  assert.deepEqual(JSON.parse(memory.get("ath-cart")), []);
  assert.equal(element("#cart-count").textContent, 0);
});
