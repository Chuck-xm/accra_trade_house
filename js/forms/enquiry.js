import { products } from "../data/catalogue.js";
import { showModal } from "../core/modal.js";
import { onAction } from "../core/events.js";
import { input, textarea, formShell } from "./fields.js";
export function enquiry(id) {
  const p = products.find((p) => p.id === id);
  if (!p) return;
  showModal(
    formShell(
      `Let’s talk ${p.name.toLowerCase()}.`,
      `Your enquiry for ${p.producer}. Tell us what you have in mind.`,
      "Product enquiry",
      /* HTML */ `<input type="hidden" name="product" value="${p.name}" />
        <div class="form-row">
          ${input("Your name", "name", "text", "e.g. Ama Mensah")}${input("Email address", "email", "email", "you@example.com")}
        </div>
        ${input("Company / organisation", "company", "text", "Your business name", false)}
        <div class="form-row">
          <label
            >Request type<select name="requestType">
              <option>Wholesale quotation</option>
              <option>Product sample</option>
              <option>Custom order</option>
              <option>General enquiry</option>
            </select></label
          >${input("Quantity required", "quantity", "text", "e.g. 100 pieces")}
        </div>
        ${textarea("Tell us more", "message", "Destination, preferred packaging, timing, or any questions…")}`,
    ),
  );
}
export function initEnquiries() {
  onAction("[data-enquire]", (target) =>
    enquiry(Number(target.dataset.enquire)),
  );
}
