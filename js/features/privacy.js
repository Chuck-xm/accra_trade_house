import { state } from "../core/state.js";
import { storage } from "../core/storage.js";
import { closeModal } from "../core/modal.js";
import { toast } from "../core/toast.js";
import { onAction } from "../core/events.js";
import { renderProducts } from "./catalogue.js";

export function initPrivacy() {
  onAction("#clear-demo-data", () => {
    state.saved = [];
    state.records = [];
    storage.set("saved", []);
    storage.set("records", []);
    storage.set("newsletter", null);
    renderProducts();
    closeModal();
    toast("Local demo data cleared.");
  });
}
