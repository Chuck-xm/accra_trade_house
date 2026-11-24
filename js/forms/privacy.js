import { showModal } from "../core/modal.js";
export function showPrivacy() {
  showModal(
    /* HTML */ `<div class="modal-eyebrow">ABOUT THIS PROTOTYPE</div>
      <h2 id="dialog-title" class="modal-title">
        A preview of what’s possible.
      </h2>
      <p class="modal-description">
        This is an independent concept prototype for review, not a live GEPA
        service. Products, producer profiles, prices, and product photography
        are illustrative. There is no checkout, payment, account authentication,
        or live stock system.
      </p>
      <p class="modal-description">
        Saved products, form submissions, and newsletter preferences are stored
        locally in this browser. Nothing is sent to producers or the Trade
        House. Avoid entering sensitive or real personal information. External
        fonts and stock photography may load from third-party providers.
      </p>
      <button class="button outline" id="clear-demo-data">
        Clear all local demo data
      </button>`,
  );
}
