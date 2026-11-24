import { state } from "../core/state.js";
import { escapeHTML } from "../core/utils.js";
import { showModal } from "../core/modal.js";
import { onAction } from "../core/events.js";
export function tradeDesk() {
  showModal(
    /* HTML */ `<div class="modal-eyebrow">YOUR LOCAL DEMO WORKSPACE</div>
      <h2 id="dialog-title" class="modal-title">My trade desk</h2>
      <p class="modal-description">
        Your saved enquiries and applications on this browser. No account or
        live submission is connected.
      </p>
      ${
        state.records.length
          ? /* HTML */ `<div class="saved-list">
              ${state.records
                .slice()
                .reverse()
                .map(
                  (r) =>
                    /* HTML */ `<div class="saved-row">
                      <div>
                        <strong>${escapeHTML(r.type)}</strong>
                        <p>
                          ${escapeHTML(r.data.product || r.data.company || r.data.name || r.data.email || "Request")}
                          · ${new Date(r.created).toLocaleDateString("en-GB")}
                        </p>
                        <p>Local demo · ${escapeHTML(r.id)}</p>
                      </div>
                    </div>`,
                )
                .join("")}
            </div>`
          : '<div class="success-box"><h3>Your next opportunity starts here.</h3><p>Request a product quote, submit a sourcing brief, or apply as a producer to try the workflow.</p></div>'
      }`,
  );
}
export function initTradeDesk() {
  document
    .querySelector("#account-button")
    .addEventListener("click", tradeDesk);
  onAction("#success-desk", tradeDesk);
}
