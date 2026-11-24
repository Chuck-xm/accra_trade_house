import { content, showModal } from "../core/modal.js";
import { state } from "../core/state.js";
import { storage } from "../core/storage.js";
import { escapeHTML } from "../core/utils.js";

// Replace this local adapter with a Django request when the backend is introduced.
export function initSubmissions() {
  content.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-form]");
    if (!form) return;
    event.preventDefault();
    if (!form.reportValidity()) return;
    const record = {
      id: `ATH-${Date.now().toString(36).toUpperCase()}`,
      type: form.dataset.form,
      data: Object.fromEntries(new FormData(form)),
      created: new Date().toISOString(),
    };
    state.records.push(record);
    const persisted = storage.set("records", state.records);
    showModal(
      /* HTML */ `<div class="modal-eyebrow">
          ${persisted ? "SAVED IN THIS BROWSER" : "SAVED FOR THIS SESSION"}
        </div>
        <h2 id="dialog-title" class="modal-title">
          Your demo request is ready.
        </h2>
        <div class="success-box">
          <h3>${escapeHTML(record.type)} saved</h3>
          <p>Reference: ${escapeHTML(record.id)}</p>
          <p>
            This is a prototype submission. It has not been sent to the Trade
            House or a producer.
          </p>
          <button class="button dark" id="success-desk">
            View my trade desk
          </button>
        </div>`,
    );
  });
}
