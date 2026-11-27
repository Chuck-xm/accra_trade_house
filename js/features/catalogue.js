import { categories, products } from "../data/catalogue.js";
import { state } from "../core/state.js";
import { photo } from "../core/utils.js";
import { productCard } from "../components/product-card.js";
import { onAction } from "../core/events.js";
import { closeCategoryMenu } from "./navigation.js";
const grid = document.querySelector("#product-grid");
export function updateSavedCount() {
  document.querySelector("#saved-count").textContent = state.saved.length;
}
export function renderCategories() {
  document.querySelector("#category-grid").innerHTML = categories
    .map(
      (c) =>
        /* HTML */ `<button class="category-card" data-category="${c.name}">
          <div class="category-photo">
            <img src="${photo(c.image)}" alt="${c.name}" loading="lazy" />
          </div>
          <strong>${c.short}</strong><small>${c.caption}</small>
        </button>`,
    )
    .join("");
  document.querySelector("#category-menu").innerHTML = categories
    .map(
      (c) => /* HTML */ `<button data-category="${c.name}">${c.short}</button>`,
    )
    .join("");
  document.querySelector("#filter-tabs").innerHTML = [
    "All products",
    ...categories.map((c) => c.name),
  ]
    .map(
      (name) =>
        /* HTML */ `<button
          data-filter="${name}"
          class="${name === state.activeCategory ? "active" : ""}"
          aria-pressed="${name === state.activeCategory}"
        >
          ${name === "All products" ? name : name.split(" & ")[0]}
        </button>`,
    )
    .join("");
}
export function filteredProducts() {
  let list = products.filter(
    (p) =>
      (state.activeCategory === "All products" ||
        p.category === state.activeCategory) &&
      `${p.name} ${p.producer} ${p.category} ${p.region}`
        .toLowerCase()
        .includes(state.query),
  );
  const sort = document.querySelector("#sort").value;
  if (sort === "price-low") list.sort((a, b) => a.price - b.price);
  if (sort === "price-high") list.sort((a, b) => b.price - a.price);
  if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}
export function renderProducts() {
  if (!grid) {
    updateSavedCount();
    return;
  }
  const list = filteredProducts();
  grid.innerHTML =
    list.slice(0, state.limit).map(productCard).join("") ||
    '<div class="empty-state"><h3>No discoveries just yet.</h3><p>Try a different search or browse all our products.</p><button class="button dark" id="reset-filters">Show all products</button></div>';
  document.querySelector("#results-note").textContent = state.query
    ? `${list.length} ${list.length === 1 ? "result" : "results"} for “${state.query}”`
    : "";
  document.querySelector("#products-title").textContent =
    state.activeCategory === "All products"
      ? "Discover something worth sharing."
      : state.activeCategory;
  document.querySelector("#load-more").hidden = list.length <= state.limit;
  document.querySelector("#product-total").textContent =
    `Showing ${Math.min(state.limit, list.length)} of ${list.length} sample products`;
  document.querySelectorAll("[data-filter]").forEach((b) => {
    b.classList.toggle("active", b.dataset.filter === state.activeCategory);
    b.setAttribute(
      "aria-pressed",
      String(b.dataset.filter === state.activeCategory),
    );
  });
  updateSavedCount();
}
export function selectCategory(name) {
  state.activeCategory = name;
  state.limit = 8;
  closeCategoryMenu();
  renderProducts();
  document.querySelector("#collections").scrollIntoView({ behavior: "smooth" });
}

export function searchProducts(value) {
  state.query = value.trim().toLowerCase();
  state.limit = 8;
  renderProducts();
}
export function resetFilters() {
  state.query = "";
  state.activeCategory = "All products";
  state.limit = 8;
  document.querySelector("#search").value = "";
  renderProducts();
}
export function initCatalogue() {
  onAction("[data-category]", (target) =>
    selectCategory(target.dataset.category),
  );
  onAction("[data-filter]", (target) => {
    state.activeCategory = target.dataset.filter;
    state.limit = 8;
    renderProducts();
  });
  onAction("#reset-filters", resetFilters);
  document.querySelector(".search").addEventListener("submit", (event) => {
    event.preventDefault();
    searchProducts(document.querySelector("#search").value);
    document
      .querySelector("#collections")
      .scrollIntoView({ behavior: "smooth" });
  });
  document
    .querySelector("#search")
    .addEventListener("input", (event) => searchProducts(event.target.value));
  document.querySelector("#sort").addEventListener("change", renderProducts);
  document.querySelector("#load-more").addEventListener("click", () => {
    state.limit += 8;
    renderProducts();
  });
  document.querySelector("#all-categories").addEventListener("click", () => {
    resetFilters();
    selectCategory("All products");
  });
  const params = new URLSearchParams(globalThis.location?.search ?? "");
  const category = params.get("category");
  if (categories.some((item) => item.name === category))
    state.activeCategory = category;
  state.query = (params.get("q") ?? "").trim().toLowerCase();
  document.querySelector("#search").value = params.get("q") ?? "";
  renderCategories();
  renderProducts();
}
