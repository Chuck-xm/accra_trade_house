import { showModal } from "../core/modal.js";
import { input, textarea, formShell } from "./fields.js";
export function showStall() {
  showModal(
    formShell(
      "Bring your best to Friday Market.",
      "Apply for a stall at the 27 November 2026 market, 8am–7pm. Allocation and any fees would be confirmed by staff.",
      "Stall application",
      /* HTML */ `<div class="form-row">
          ${input("Your name", "name")}${input("Business name", "company")}
        </div>
        ${input("Email address", "email", "email")}<label
          >Preferred market date<select name="marketDate">
            <option>27 November 2026</option>
            <option>25 December 2026 — provisional</option>
          </select></label
        >${textarea("What will you be selling?", "message", "Products, display requirements, and any special requests.")}`,
      "Save demo application",
    ),
  );
}
