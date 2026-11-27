import { clearCart } from "./cart.js";
import { state } from "../core/state.js";
import { storage } from "../core/storage.js";
import { closeModal } from "../core/modal.js";
import { toast } from "../core/toast.js";
import { onAction } from "../core/events.js";
import { updateSavedControls } from "./saved-products.js";
import { renderProducts } from "./catalogue.js";

export function initPrivacy() {
  onAction("#clear-demo-data", () => {
    clearCart();
    state.saved = [];
    state.records = [];
    storage.set("saved", []);
    storage.set("records", []);
    storage.set("newsletter", null);
    renderProducts();
    updateSavedControls();
    closeModal();
    toast("Local demo data cleared.");
  });
}
