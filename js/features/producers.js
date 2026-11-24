import { showModal, closeModal } from "../core/modal.js";
import { onAction } from "../core/events.js";
import { state } from "../core/state.js";
import { searchProducts } from "./catalogue.js";

export function initProducers() {
  onAction("[data-producer]", (target) => {
    const producer = target.dataset.producer;
    showModal(
      /* HTML */ `<div class="modal-eyebrow">
          MEET OUR MAKERS · ILLUSTRATIVE PROFILE
        </div>
        <h2 id="dialog-title" class="modal-title">${producer}</h2>
        <p class="modal-description">
          ${producer === "Adom Harvest Co." ? "An illustrative farming business connecting buyers to fresh Ghanaian produce." : "An illustrative craft studio bringing natural materials and thoughtful making to everyday objects."}
        </p>
        <p class="modal-description">
          Discover their sample products and request a quote to explore the
          prototype buyer journey.
        </p>
        <button class="button dark" data-find-producer="${producer}">
          Browse their products
        </button>`,
    );
  });
  onAction("[data-find-producer]", (target) => {
    document.querySelector("#search").value = target.dataset.findProducer;
    state.activeCategory = "All products";
    closeModal();
    searchProducts(target.dataset.findProducer);
    document
      .querySelector("#collections")
      .scrollIntoView({ behavior: "smooth" });
  });
}
