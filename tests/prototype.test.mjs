import { test } from "node:test";
import assert from "node:assert/strict";

// A small DOM adapter exercises module loading and delegated event integration.
// Browser layout and native constraint validation require a browser check.
const elements = new Map();
const documentListeners = new Map();
const memory = new Map([
  ["ath-saved", "[2]"],
  ["ath-records", "[]"],
]);
function element(key) {
  if (!elements.has(key)) {
    elements.set(key, {
      innerHTML: "",
      textContent: "",
      value: key === "#sort" ? "featured" : "",
      hidden: false,
      open: false,
      attributes: {},
      listeners: new Map(),
      classList: { add() {}, remove() {}, toggle() {} },
      setAttribute(name, value) {
        this.attributes[name] = value;
      },
      addEventListener(type, callback) {
        if (!this.listeners.has(type)) this.listeners.set(type, []);
        this.listeners.get(type).push(callback);
      },
      querySelector(selector) {
        return element(`${key} ${selector}`);
      },
      scrollIntoView() {},
      focus() {},
      showModal() {
        this.open = true;
      },
      close() {
        this.open = false;
      },
      getBoundingClientRect() {
        return { left: 0, right: 1000, top: 0, bottom: 1000 };
      },
    });
  }
  return elements.get(key);
}
globalThis.document = {
  querySelector: element,
  querySelectorAll: () => [],
  activeElement: { focus() {} },
  addEventListener(type, callback) {
    if (!documentListeners.has(type)) documentListeners.set(type, []);
    documentListeners.get(type).push(callback);
  },
  createElement: () => ({ click() {} }),
};
globalThis.localStorage = {
  getItem: (key) => memory.get(key) ?? null,
  setItem: (key, value) => memory.set(key, value),
};
globalThis.FormData = class {
  constructor(form) {
    return Object.entries(form.values);
  }
};
function click({ dataset = {}, id = "" }) {
  const target = {
    dataset,
    id,
    closest(selector) {
      if (selector.startsWith("#"))
        return selector.split(",").some((part) => part.trim() === `#${id}`)
          ? this
          : null;
      const attribute = selector.match(/^\[data-([a-z-]+)\]$/)?.[1];
      const key = attribute?.replace(/-([a-z])/g, (_, letter) =>
        letter.toUpperCase(),
      );
      return key && key in dataset ? this : null;
    },
  };
  for (const callback of documentListeners.get("click") ?? [])
    callback({ target });
}
function emit(selector, type, event = {}) {
  for (const callback of element(selector).listeners.get(type) ?? [])
    callback(event);
}

await import("../index.js");
const { state } = await import("../js/core/state.js");
const catalogue = await import("../js/features/catalogue.js");
const { productDetails } = await import("../js/features/product-details.js");
const { tradeDesk } = await import("../js/features/trade-desk.js");

await test("Friday Market advert opens on arrival, closes with ×, and can be reopened", () => {
  assert.equal(element("#modal").open, true);
  assert.equal(element("#modal").className, "market-advert");
  assert.match(element("#modal-content").innerHTML, /Your Friday/);
  assert.match(element("#modal-content").innerHTML, /NOVEMBER 2026/);
  emit("#modal .modal-close", "click");
  assert.equal(element("#modal").open, false);
  click({ dataset: { modal: "market" } });
  assert.equal(element("#modal").open, true);
  assert.equal(element("#modal").className, "market-advert");
  click({ dataset: { modal: "stall" } });
  assert.equal(element("#modal").className, "");
  assert.match(
    element("#modal-content").innerHTML,
    /data-form="Stall application"/,
  );
  emit("#modal .modal-close", "click");
});

await test("module entry point renders the catalogue and restores existing saved products", () => {
  assert.equal(
    (element("#product-grid").innerHTML.match(/class="product-card"/g) ?? [])
      .length,
    8,
  );
  assert.deepEqual(state.saved, [2]);
  assert.equal(element("#saved-count").textContent, 1);
});
await test("search, category, sorting, empty results, and load more stay connected", () => {
  catalogue.searchProducts("pineapple");
  assert.equal(catalogue.filteredProducts().length, 1);
  assert.match(element("#product-grid").innerHTML, /Fresh golden pineapple/);
  catalogue.searchProducts("nothing-matches-this");
  assert.match(element("#product-grid").innerHTML, /No discoveries just yet/);
  click({ id: "reset-filters" });
  click({ dataset: { category: "Home & Craft" } });
  assert.equal(catalogue.filteredProducts().length, 2);
  catalogue.resetFilters();
  element("#sort").value = "price-low";
  emit("#sort", "change");
  assert.equal(catalogue.filteredProducts()[0].id, 5);
  emit("#load-more", "click");
  assert.equal(
    (element("#product-grid").innerHTML.match(/class="product-card"/g) ?? [])
      .length,
    12,
  );
});
await test("saved product delegation persists once and refreshes cards and saved list", () => {
  click({ dataset: { save: "1" } });
  assert.deepEqual(JSON.parse(memory.get("ath-saved")), [2, 1]);
  emit("#saved-button", "click");
  assert.match(
    element("#modal-content").innerHTML,
    /Single-origin dark chocolate/,
  );
  click({ dataset: { removeSave: "1" } });
  assert.deepEqual(JSON.parse(memory.get("ath-saved")), [2]);
  assert.doesNotMatch(
    element("#modal-content").innerHTML,
    /Single-origin dark chocolate/,
  );
});
await test("product details and independent form modules open through delegated actions", () => {
  productDetails(1);
  assert.match(
    element("#modal-content").innerHTML,
    /Single-origin dark chocolate/,
  );
  click({ dataset: { enquire: "1" } });
  assert.match(
    element("#modal-content").innerHTML,
    /data-form="Product enquiry"/,
  );
  for (const flow of [
    "producer",
    "stall",
    "sourcing",
    "contact",
    "market",
    "privacy",
  ]) {
    click({ dataset: { modal: flow } });
    assert.match(element("#modal-content").innerHTML, /id="dialog-title"/);
  }
});
await test("form submission persists to the same storage key and appears in the trade desk", () => {
  const form = {
    dataset: { form: "Product enquiry" },
    reportValidity: () => true,
    values: {
      name: "<Demo buyer>",
      email: "demo@example.com",
      product: "Single-origin dark chocolate",
      message: "100 bars",
    },
  };
  emit("#modal-content", "submit", {
    target: { closest: () => form },
    preventDefault() {},
  });
  assert.equal(JSON.parse(memory.get("ath-records")).length, 1);
  assert.match(element("#modal-content").innerHTML, /has not been sent/);
  click({ id: "success-desk" });
  assert.match(
    element("#modal-content").innerHTML,
    /Single-origin dark chocolate/,
  );
  state.records[0].data.product = "<script>sample</script>";
  tradeDesk();
  assert.doesNotMatch(element("#modal-content").innerHTML, /<script>/);
  assert.match(element("#modal-content").innerHTML, /&lt;script&gt;/);
});
await test("producer search and clearing demo data update shared state across modules", () => {
  click({ dataset: { findProducer: "Adom Harvest Co." } });
  assert.equal(catalogue.filteredProducts().length, 1);
  click({ id: "clear-demo-data" });
  assert.deepEqual(state.saved, []);
  assert.deepEqual(state.records, []);
  assert.deepEqual(JSON.parse(memory.get("ath-records")), []);
  assert.equal(element("#saved-count").textContent, 0);
});
