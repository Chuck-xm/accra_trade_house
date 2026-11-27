import { test } from "node:test";
import assert from "node:assert/strict";
import { escapeHTML } from "../js/core/utils.js";
import { products } from "../js/data/catalogue.js";
import {
  productUrl,
  productFromSearch,
} from "../js/features/product-details.js";

const elements = new Map();
const listeners = new Map();
const memory = new Map();
function element(key) {
  if (!elements.has(key))
    elements.set(key, {
      innerHTML: "",
      textContent: "",
      value: "",
      open: false,
      attributes: {},
      listeners: {},
      dataset: {},
      classList: { toggle() {}, add() {}, remove() {} },
      addEventListener(type, callback) {
        (this.listeners[type] ??= []).push(callback);
      },
      setAttribute(name, value) {
        this.attributes[name] = value;
      },
      querySelector(selector) {
        return element(`${key} ${selector}`);
      },
      showModal() {
        this.open = true;
      },
      close() {
        this.open = false;
      },
      focus() {},
    });
  return elements.get(key);
}
const saveButton = element("page-save");
saveButton.dataset.save = "1";
globalThis.document = {
  title: "",
  activeElement: saveButton,
  querySelector: (selector) =>
    selector === "#product-grid" ? null : element(selector),
  querySelectorAll: (selector) =>
    selector === "[data-save]" ? [saveButton] : [],
  addEventListener(type, callback) {
    (listeners.get(type) ?? listeners.set(type, []).get(type)).push(callback);
  },
};
globalThis.localStorage = {
  getItem: (key) => memory.get(key) ?? null,
  setItem: (key, value) => memory.set(key, value),
};
globalThis.location = { search: "?id=1" };
globalThis.FormData = class {
  constructor(form) {
    return Object.entries(form.values);
  }
};
function click(key, value) {
  const target = {
    dataset: { [key]: value },
    closest(selector) {
      const attribute = selector.match(/^\[data-([a-z-]+)\]$/)?.[1];
      const wanted = attribute?.replace(/-([a-z])/g, (_, letter) =>
        letter.toUpperCase(),
      );
      return wanted === key ? this : null;
    },
  };
  for (const listener of listeners.get("click") ?? []) listener({ target });
}

await import("../product.js");
const { initProductPage, productPageMarkup } =
  await import("../js/features/product-page.js");

await test("every sample product has a direct, reloadable preview URL", () => {
  for (const product of products) {
    assert.equal(
      productFromSearch(
        new URL(productUrl(product.id), "http://localhost").search,
      ),
      product,
    );
    initProductPage(`?id=${product.id}`);
    assert.ok(
      element("#product-page").innerHTML.includes(escapeHTML(product.name)),
    );
    assert.ok(document.title.includes(product.name));
  }
  initProductPage("?id=1");
  assert.match(element("#product-page").innerHTML, /data-enquire="1"/);
  assert.match(element("#product-page").innerHTML, /data-add-cart="1"/);
  assert.match(
    element("#product-page").innerHTML,
    /index\.html\?q=Golden%20Pod%20Chocolate/,
  );
  assert.match(
    element("#category-menu").innerHTML,
    /index\.html\?category=Food%20%26%20Agriculture/,
  );
  assert.equal(element("#modal").open, false);
});

await test("missing and invalid IDs render a recovery page, with no enquiry actions", () => {
  for (const search of [
    "",
    "?id=",
    "?id=1x",
    "?id=0",
    "?id=-1",
    "?id=99999",
    "?id=%3Cscript%3E",
  ]) {
    assert.equal(productFromSearch(search), null);
    initProductPage(search);
    assert.match(element("#product-page").innerHTML, /Product not found/);
    assert.match(
      element("#product-page").innerHTML,
      /href="index\.html#collections"/,
    );
    assert.doesNotMatch(element("#product-page").innerHTML, /data-enquire=/);
  }
  initProductPage("?id=1");
});

await test("save and unsave work on a page without the homepage catalogue", () => {
  click("save", "1");
  assert.deepEqual(JSON.parse(memory.get("ath-saved")), [1]);
  assert.equal(element("#saved-count").textContent, 1);
  assert.equal(saveButton.attributes["aria-pressed"], "true");
  assert.equal(
    element("page-save [data-save-label]").textContent,
    "Product saved",
  );
  for (const callback of element("#saved-button").listeners.click) callback();
  assert.match(
    element("#modal-content").innerHTML,
    /href="product\.html\?id=1"/,
  );
  click("removeSave", "1");
  assert.deepEqual(JSON.parse(memory.get("ath-saved")), []);
  assert.equal(saveButton.attributes["aria-pressed"], "false");
});

await test("retail purchases replace samples while wholesale enquiry remains connected", () => {
  element('[data-retail-quantity="1"]').value = "1";
  click("addCart", "1");
  assert.deepEqual(JSON.parse(memory.get("ath-cart")), [
    { productId: 1, quantity: 1 },
  ]);
  assert.equal(element("#cart-count").textContent, 1);
  click("enquire", "1");
  assert.match(
    element("#modal-content").innerHTML,
    /data-form="Product enquiry"/,
  );

  const form = {
    dataset: { form: "Product enquiry" },
    reportValidity: () => true,
    values: {
      product: products[0].name,
      requestType: "Wholesale quotation",
      name: "Demo",
      email: "demo@example.com",
    },
  };
  for (const callback of element("#modal-content").listeners.submit)
    callback({ target: { closest: () => form }, preventDefault() {} });
  assert.equal(
    JSON.parse(memory.get("ath-records"))[0].data.requestType,
    "Wholesale quotation",
  );
  assert.match(element("#modal-content").innerHTML, /has not been sent/);
});

await test("page content escapes listing text and related products exclude the current listing", () => {
  const html = productPageMarkup({
    ...products[0],
    name: "<script>bad</script>",
    producer: "<b>producer</b>",
  });
  assert.doesNotMatch(html, /<script>|<b>producer/);
  assert.match(html, /&lt;script&gt;/);
  const related = html.slice(html.indexOf('class="product-related"'));
  assert.doesNotMatch(related, /href="product\.html\?id=1"/);
});
