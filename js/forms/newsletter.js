import { showModal, content } from "../core/modal.js";
import { input, demoNote } from "./fields.js";
export function initNewsletter() {
  document
    .querySelector("#newsletter-form")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const email = document.querySelector("#newsletter-email").value;
      showModal(
        /* HTML */ `<div class="modal-eyebrow">STAY IN THE LOOP · DEMO</div>
          <h2 id="dialog-title" class="modal-title">
            Preview newsletter signup
          </h2>
          <p class="modal-description">
            This prototype can save your newsletter preference locally. It does
            not send your email or subscribe you to a mailing list.
          </p>
          <form class="modal-form" data-form="Newsletter preference">
            ${input("Email address", "email", "email")}<label class="consent"
              ><input type="checkbox" required />Save this demo preference on
              this browser.</label
            >${demoNote}<button class="button dark">
              Save demo preference
            </button>
          </form>`,
      );
      content.querySelector('[name="email"]').value = email;
      event.target.reset();
    });
}
