import { showModal } from "../core/modal.js";
import { icon } from "../core/icons.js";

// Shared by the arrival advert and the navigation's Friday Market buttons.
// The event date stays fixed until the scheduling change is implemented.
export function showMarket() {
  showModal(
    /* HTML */ `
      <section class="market-card">
        <div class="market-top">
          <span class="eyebrow">GOOD FINDS. GREAT PEOPLE.</span>
          <span class="market-sun" aria-hidden="true">✳</span>
        </div>
        <p class="market-kicker">THE MONTHLY FRIDAY MARKET</p>
        <h2 id="dialog-title">Your Friday.<br />Made in Ghana.</h2>
        <p class="market-intro">
          A day to shop local, meet our makers, and discover something special.
          Food, fashion, craft, and a little Ghanaian goodness.
        </p>
        <div class="market-date">
          <strong>27</strong>
          <span>NOVEMBER 2026<br /><b>Friday · 8am – 7pm</b></span>
        </div>
        <p class="market-location">${icon("pin")} Accra Trade House, Accra</p>
        <p class="market-schedule">Every last Friday of the month.</p>
        <button class="button dark" id="download-calendar">
          Make a date with Ghana ${icon("calendar")}
        </button>
        <button class="text-button" data-modal="stall">
          Are you a maker? Apply for a stall
        </button>
        <p class="market-note">
          Prototype event listing. Confirm arrangements before visiting.
        </p>
        <div class="market-pattern" aria-hidden="true">╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲</div>
      </section>
    `,
    { className: "market-advert" },
  );
}
