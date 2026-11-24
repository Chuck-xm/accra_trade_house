import { showModal } from "../core/modal.js";
import { input, textarea, formShell } from "./fields.js";
export function showSourcing() {
  showModal(
    formShell(
      "Let’s find your next great product.",
      "Share your sourcing brief and explore what Ghanaian producers can offer.",
      "Sourcing request",
      /* HTML */ `<div class="form-row">
          ${input("Your name", "name")}${input("Company", "company")}
        </div>
        ${input("Email address", "email", "email")}
        <div class="form-row">
          ${input("Destination country", "country")}${input("Estimated quantity", "quantity", "text", "e.g. 500 units")}
        </div>
        ${textarea("Your sourcing brief", "message", "What products, specifications, budget, and delivery timing do you need?")}`,
    ),
  );
}
