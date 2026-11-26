// Application entry point: each feature owns its rendering and event handlers.
import { initIcons } from "./js/core/icons.js";
import { initModal } from "./js/core/modal.js";
import { initNavigation } from "./js/features/navigation.js";
import { initCatalogue } from "./js/features/catalogue.js";
import { initProductDetails } from "./js/features/product-details.js";
import { initSavedProducts } from "./js/features/saved-products.js";
import { initTradeDesk } from "./js/features/trade-desk.js";
import { initProducers } from "./js/features/producers.js";
import { initMarketCalendar } from "./js/features/market-calendar.js";
import { initPrivacy } from "./js/features/privacy.js";
import { initFlows } from "./js/forms/index.js";
import { initEnquiries } from "./js/forms/enquiry.js";
import { initSubmissions } from "./js/forms/submissions.js";
import { initMarketAdvert } from "./js/features/market-advert.js";
import { initHeroCarousel } from "./js/features/hero-carousel.js";
import { initNewsletter } from "./js/forms/newsletter.js";

initIcons();
initModal();
initNavigation();
initCatalogue();
initProductDetails();
initSavedProducts();
initTradeDesk();
initProducers();
initMarketCalendar();
initPrivacy();
initFlows();
initEnquiries();
initSubmissions();
initNewsletter();
initHeroCarousel();

// Showing the Friday Market promotion once per tab session.
initMarketAdvert();
