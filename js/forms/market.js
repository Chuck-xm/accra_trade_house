import { showModal } from "../core/modal.js";

// Shared by the arrival advert and the navigation's Friday Market buttons.
// Display the supplied artwork as-is; event scheduling is handled separately.
export function showMarket() {
  showModal(
    /* HTML */ `
      <section class="market-flyer">
        <h2 id="dialog-title" class="sr-only">Friday Market flyer</h2>
        <img
          class="market-flyer-image"
          src="assets/Friday%20Market.jpg"
          width="1748"
          height="2480"
          alt="Flyer advertising GEPA Friday Market on 19 December 2026, 7am–7pm, at Africa Trade House Forecourt, featuring Made-in-Ghana products."
        />
      </section>
    `,
    { className: "market-advert" },
  );
}
