import { showMarket } from "../forms/market.js";

const sessionKey = "ath-market-advert-seen";

// Show automatically once per tab session; navigation can always reopen it.
export function initMarketAdvert() {
  try {
    if (sessionStorage.getItem(sessionKey)) return;
  } catch {
    // Storage may be unavailable in restricted browsers.
  }
  showMarket();
  try {
    sessionStorage.setItem(sessionKey, "true");
  } catch {
    // The flyer remains usable without session storage.
  }
}
