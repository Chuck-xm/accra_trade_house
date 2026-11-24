import { showModal } from "../core/modal.js";
import { input, textarea, formShell } from "./fields.js";
export function showContact() {
  showModal(
    formShell(
      "Come say hello.",
      "Plan a showroom visit or ask about the Trade House. Exact address and contact details will be added after confirmation.",
      "Visit / contact request",
      `${input("Your name", "name")}${input("Email address", "email", "email")}${input("Preferred visit date (optional)", "visitDate", "date", "", false)}${textarea("How can we help?", "message", "Tell us about your visit or question.")}`,
    ),
  );
}
