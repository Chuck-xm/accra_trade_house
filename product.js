// Product page entry point; shared workflows use the same local prototype data.
import { initProductPage } from "./js/features/product-page.js";
import { initIcons } from "./js/core/icons.js";
import { initModal } from "./js/core/modal.js";
import { initNavigation } from "./js/features/navigation.js";
import { initSavedProducts } from "./js/features/saved-products.js";
import { initTradeDesk } from "./js/features/trade-desk.js";
import { initPrivacy } from "./js/features/privacy.js";
import { initFlows } from "./js/forms/index.js";
import { initEnquiries } from "./js/forms/enquiry.js";
import { initSubmissions } from "./js/forms/submissions.js";
import { initCart } from "./js/features/cart.js";
import { updateSavedCount } from "./js/features/catalogue.js";

initProductPage();
initIcons();
initModal();
initNavigation();
initSavedProducts();
updateSavedCount();
initTradeDesk();
initPrivacy();
initFlows();
initEnquiries();
initSubmissions();
initCart();
