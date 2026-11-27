import { initIcons } from "./js/core/icons.js";
import { initModal } from "./js/core/modal.js";
import { initNavigation } from "./js/features/navigation.js";
import { initSavedProducts } from "./js/features/saved-products.js";
import { updateSavedCount } from "./js/features/catalogue.js";
import { initTradeDesk } from "./js/features/trade-desk.js";
import { initPrivacy } from "./js/features/privacy.js";
import { initFlows } from "./js/forms/index.js";
import { initEnquiries } from "./js/forms/enquiry.js";
import { initSubmissions } from "./js/forms/submissions.js";
import { initCart } from "./js/features/cart.js";
import { initCartPage } from "./js/features/cart-page.js";
import { categoryUrl } from "./js/features/product-page.js";
import { categories } from "./js/data/catalogue.js";
import { escapeHTML } from "./js/core/utils.js";

document.querySelector("#category-menu").innerHTML = categories
  .map(
    (category) =>
      `<a href="${categoryUrl(category.name)}">${escapeHTML(category.short)}</a>`,
  )
  .join("");
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
initCartPage();
