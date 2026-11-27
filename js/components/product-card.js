import { icon } from "../core/icons.js";
import { state } from "../core/state.js";
import { photo, money } from "../core/utils.js";
import { productUrl } from "../features/product-details.js";

export function productCard(p) {
  return /* HTML */ `<article class="product-card">
    <div class="product-image">
      <a href="${productUrl(p.id)}" aria-label="View ${p.name}">
        <img src="${photo(p.image)}" alt="${p.name}" loading="lazy" /></a
      ><button
        class="save-product ${state.saved.includes(p.id) ? "saved" : ""}"
        data-save="${p.id}"
        aria-label="${state.saved.includes(p.id) ? "Unsave" : "Save"} ${p.name}"
        aria-pressed="${state.saved.includes(p.id)}"
      >
        ${icon("heart")}
      </button>
    </div>
    <div class="product-category">${p.category}</div>
    <a class="product-name" href="${productUrl(p.id)}"> ${p.name} </a>
    <div class="producer-name">${p.producer}</div>
    <div class="product-price-row">
      <span class="product-price"
        >${money(p.price)} <small>/ ${p.unit}</small></span
      ><button
        class="card-cart-button"
        data-add-cart="${p.id}"
        aria-label="Add ${p.name} to cart"
        title="Add to cart"
        type="button"
      >
        ${icon("bag")}
      </button>
    </div>
  </article>`;
}
