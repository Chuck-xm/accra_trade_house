import { categories, products } from "../data/catalogue.js";
import { icon } from "../core/icons.js";
import { photo, money, escapeHTML as e } from "../core/utils.js";
import { state } from "../core/state.js";
import { productCard } from "../components/product-card.js";
import { productFromSearch } from "./product-details.js";

export const categoryUrl = (name) =>
  `index.html?category=${encodeURIComponent(name)}#collections`;

export function productPageMarkup(p) {
  if (!p)
    return /* HTML */ `<section class="product-not-found">
      <span class="eyebrow muted">ACCRA TRADE HOUSE</span>
      <h1>Product not found.</h1>
      <p>
        This product link is missing or no longer available. Browse the
        marketplace to find your next discovery.
      </p>
      <a class="button dark" href="index.html#collections"
        >Back to the marketplace</a
      >
    </section>`;

  const saved = state.saved.includes(p.id);
  const related = products
    .filter((item) => item.id !== p.id)
    .sort(
      (a, b) =>
        Number(b.category === p.category) - Number(a.category === p.category),
    )
    .slice(0, 3);

  return /* HTML */ ` <nav class="product-breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li><a href="index.html">Home</a></li>
        <li><a href="index.html#collections">Marketplace</a></li>
        <li><a href="${categoryUrl(p.category)}">${e(p.category)}</a></li>
        <li aria-current="page">${e(p.name)}</li>
      </ol>
    </nav>
    <a class="product-back" href="index.html#collections"
      ><span aria-hidden="true">←</span> Back to the marketplace</a
    >
    <section class="product-overview" aria-labelledby="product-title">
      <figure class="product-gallery">
        <a
          class="product-image-stage"
          href="${photo(p.image)}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open full-size image of ${e(p.name)} (opens in a new tab)"
        >
          <img
            src="${photo(p.image)}"
            alt="${e(p.name)}"
            width="800"
            height="800"
            fetchpriority="high"
          />
        </a>
        <figcaption>
          Illustrative product photography
          <a href="${photo(p.image)}" target="_blank" rel="noopener noreferrer"
            >View full size <span aria-hidden="true">↗</span
            ><span class="sr-only"> (opens in a new tab)</span></a
          >
        </figcaption>
      </figure>
      <div class="product-summary">
        <a class="product-type" href="${categoryUrl(p.category)}"
          >${e(p.category)}</a
        >
        <h1 id="product-title">${e(p.name)}</h1>
        <p class="product-byline">
          By <a href="#producer-details">${e(p.producer)}</a>
          <span aria-hidden="true">·</span> ${e(p.region)}, Ghana
        </p>
        <p class="product-preview-price">
          ${money(p.price)} <span>/ ${e(p.unit)}</span>
        </p>
        <p class="product-price-note">
          Illustrative retail price. Final pricing and availability require
          confirmation.
        </p>
        <p class="product-introduction">${e(p.description)}</p>
        <dl class="product-quick-facts">
          <div>
            <dt>Indicative wholesale minimum</dt>
            <dd>${e(p.moq)}</dd>
          </div>
          <div>
            <dt>Product unit</dt>
            <dd>${e(p.unit)}</dd>
          </div>
        </dl>
        <div class="product-retail-order">
          <label for="retail-quantity"
            >Retail quantity <small>Buy from 1 ${e(p.unit)}</small></label
          >
          <input
            id="retail-quantity"
            data-retail-quantity="${p.id}"
            type="number"
            min="1"
            max="99"
            step="1"
            inputmode="numeric"
            value="1"
          />
        </div>
        <div class="product-primary-actions">
          <button class="button dark" type="button" data-add-cart="${p.id}">
            ${icon("bag")} Add to cart
          </button>
          <a class="button outline" href="cart.html">View cart</a>
        </div>
        <div class="product-wholesale-action">
          <p>Buying in bulk? Indicative wholesale minimum: ${e(p.moq)}.</p>
          <button class="text-button" type="button" data-enquire="${p.id}">
            Request a wholesale quote <span aria-hidden="true">→</span>
          </button>
        </div>
        <button
          class="product-save"
          data-save="${p.id}"
          aria-pressed="${saved}"
          aria-label="${saved ? "Unsave" : "Save"} ${e(p.name)}"
        >
          ${icon("heart")}
          <span data-save-label
            >${saved ? "Product saved" : "Save product"}</span
          >
        </button>
        <p class="product-prototype-note">
          Prototype listing · Orders and enquiries are saved in your browser for
          review.
        </p>
      </div>
    </section>
    <nav class="product-section-links" aria-label="Product information">
      <a href="#product-description">Overview</a
      ><a href="#trade-details">Trade details</a
      ><a href="#producer-details">Producer</a>
    </nav>
    <div class="product-details-layout">
      <section
        class="product-detail-section"
        id="product-description"
        aria-labelledby="description-heading"
      >
        <h2 id="description-heading">About this product</h2>
        <p>${e(p.description)}</p>
        <p>
          Contact the producer through the Trade House to discuss your
          requirements, sample options, packaging and intended destination.
        </p>
      </section>
      <section
        class="product-detail-section"
        id="trade-details"
        aria-labelledby="trade-heading"
      >
        <h2 id="trade-heading">Trade details</h2>
        <dl class="product-specifications">
          <div>
            <dt>Category</dt>
            <dd>${e(p.category)}</dd>
          </div>
          <div>
            <dt>Region</dt>
            <dd>${e(p.region)}, Ghana</dd>
          </div>
          <div>
            <dt>Indicative wholesale minimum</dt>
            <dd>${e(p.moq)}</dd>
          </div>
          <div>
            <dt>Product reference</dt>
            <dd>ATH-${String(p.id).padStart(4, "0")}</dd>
          </div>
          <div>
            <dt>Availability & delivery</dt>
            <dd>Confirm when enquiring</dd>
          </div>
        </dl>
      </section>
      <section
        class="product-detail-section product-producer"
        id="producer-details"
        aria-labelledby="producer-heading"
      >
        <span class="product-type">THE PEOPLE BEHIND THE PRODUCT</span>
        <h2 id="producer-heading">${e(p.producer)}</h2>
        <p>${e(p.region)}, Ghana</p>
        <p>
          Explore this illustrative producer’s products, or ask the Trade House
          about sourcing and wholesale opportunities.
        </p>
        <a
          class="text-button"
          href="index.html?q=${encodeURIComponent(p.producer)}#collections"
          >Browse this producer’s products <span aria-hidden="true">→</span></a
        >
      </section>
    </div>
    <aside class="product-disclaimer">
      Sample product for prototype review. Product photography, businesses and
      prices are illustrative. Specifications, certifications, stock and
      delivery arrangements require confirmation. Demo orders are saved locally;
      no live order is sent and no payment is collected.
    </aside>
    <section class="product-related" aria-labelledby="related-heading">
      <div class="section-heading">
        <h2 id="related-heading">More to discover</h2>
        <a class="text-button" href="index.html#collections"
          >View marketplace <span aria-hidden="true">→</span></a
        >
      </div>
      <div class="product-grid">${related.map(productCard).join("")}</div>
    </section>`;
}

export function initProductPage(search = globalThis.location?.search ?? "") {
  const product = productFromSearch(search);
  document.querySelector("#product-page").innerHTML =
    productPageMarkup(product);
  document.title = `${product ? product.name : "Product not found"} — Accra Trade House`;
  document.querySelector("#category-menu").innerHTML = categories
    .map(
      (category) =>
        `<a href="${categoryUrl(category.name)}">${e(category.short)}</a>`,
    )
    .join("");
  return product;
}
