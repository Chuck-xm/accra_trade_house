import { showMarket } from "../forms/market.js";

// Every page load is a new visit; dismissing the advert is not persisted.
export function initMarketAdvert() {
  showMarket();
}
