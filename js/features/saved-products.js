import { products } from "../data/catalogue.js";
import { state } from "../core/state.js";
import { storage } from "../core/storage.js";
import { photo, money } from "../core/utils.js";
import { showModal } from "../core/modal.js";
import { toast } from "../core/toast.js";
import { onAction } from "../core/events.js";
import { productUrl } from "./product-details.js";
import { renderProducts } from "./catalogue.js";
export function savedList() {
  showModal(
    /* HTML */ `<div class="modal-eyebrow">GOOD FINDS, KEPT CLOSE</div>
      <h2 id="dialog-title" class="modal-title">Your saved discoveries</h2>
      <p class="modal-description">
        ${state.saved.length}
        ${state.saved.length === 1 ? "product" : "products"} saved on this
        browser.
      </p>
      <div class="saved-list">
        ${
          products
            .filter((p) => state.saved.includes(p.id))
            .map(
              (p) =>
                /* HTML */ `<div class="saved-row">
                  <img src="${photo(p.image)}" alt="${p.name}" />
                  <div>
                    <strong>${p.name}</strong>
                    <p>${p.producer} · ${money(p.price)}</p>
                    <a class="saved-product-link" href="${productUrl(p.id)}"
                      >View product</a
                    >
                  </div>
                  <button
                    data-remove-save="${p.id}"
                    aria-label="Remove ${p.name}"
                  >
                    Remove
                  </button>
                </div>`,
            )
            .join("") ||
          '<p class="modal-description">Tap the heart on a product to save it for later.</p>'
        }
      </div>`,
  );
}
export function updateSavedControls() {
  document.querySelectorAll("[data-save]").forEach((button) => {
    const product = products.find(
      (item) => item.id === Number(button.dataset.save),
    );
    if (!product) return;
    const saved = state.saved.includes(product.id);
    button.setAttribute("aria-pressed", String(saved));
    button.setAttribute(
      "aria-label",
      `${saved ? "Unsave" : "Save"} ${product.name}`,
    );
    button.classList.toggle("saved", saved);
    const label = button.querySelector("[data-save-label]");
    if (label) label.textContent = saved ? "Product saved" : "Save product";
  });
}

export function initSavedProducts() {
  updateSavedControls();
  document.querySelector("#saved-button").addEventListener("click", savedList);
  onAction("[data-save]", (target) => {
    const id = Number(target.dataset.save);
    state.saved = state.saved.includes(id)
      ? state.saved.filter((value) => value !== id)
      : [...state.saved, id];
    const persisted = storage.set("saved", state.saved);
    renderProducts();
    updateSavedControls();
    toast(
      persisted
        ? state.saved.includes(id)
          ? "Added to your saved discoveries."
          : "Product removed from saved discoveries."
        : "Saved for this session. Browser storage is unavailable.",
    );
  });
  onAction("[data-remove-save]", (target) => {
    state.saved = state.saved.filter(
      (id) => id !== Number(target.dataset.removeSave),
    );
    storage.set("saved", state.saved);
    renderProducts();
    updateSavedControls();
    savedList();
  });
}
