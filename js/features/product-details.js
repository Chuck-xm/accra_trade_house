import { products } from "../data/catalogue.js";
import { icon } from "../core/icons.js";
import { photo, money } from "../core/utils.js";
import { showModal } from "../core/modal.js";
import { onAction } from "../core/events.js";
export function productDetails(id) {
  const p = products.find((p) => p.id === id);
  if (!p) return;
  showModal(
    /* HTML */ `<img
        class="modal-product-image"
        src="${photo(p.image)}"
        alt="${p.name}"
      />
      <div class="modal-eyebrow">${p.category.toUpperCase()}</div>
      <h2 id="dialog-title" class="modal-title">${p.name}</h2>
      <p class="modal-description">By ${p.producer} · ${p.region}</p>
      <p class="modal-description">${p.description}</p>
      <div class="detail-tags">
        <span>Indicative MOQ: ${p.moq}</span
        ><span>Wholesale enquiries welcome</span>
      </div>
      <p class="modal-price">
        ${money(p.price)} <small>/ ${p.unit} · illustrative price</small>
      </p>
      <button class="button dark" data-enquire="${p.id}">
        Request a quote or sample ${icon("bag")}
      </button>
      <p class="form-note" style="margin-top:16px">
        Sample listing for prototype review. Photography is illustrative. Stock,
        specifications, certifications, and final pricing require confirmation.
      </p>`,
  );
}
export function initProductDetails() {
  onAction("[data-product]", (target) =>
    productDetails(Number(target.dataset.product)),
  );
}
