import { showModal } from "../core/modal.js";
import { input, textarea, formShell } from "./fields.js";
import { categories } from "../data/catalogue.js";
export function showProducer() {
  showModal(
    formShell(
      "Made in Ghana? Make your next connection.",
      "Start a producer application for the Accra Trade House marketplace.",
      "Producer application",
      /* HTML */ `<div class="form-row">
          ${input("Contact name", "name")}${input("Business name", "company")}
        </div>
        ${input("Email address", "email", "email")}
        <div class="form-row">
          <label
            >Product category<select name="category">
              ${categories.map((c) => /* HTML */ `<option>${c.name}</option>`).join("")}
            </select></label
          >${input("Region", "region", "text", "e.g. Greater Accra")}
        </div>
        ${textarea("What do you make?", "message", "Describe your products, capacity, and what you hope to achieve.")}`,
      "Save demo application",
    ),
  );
}
