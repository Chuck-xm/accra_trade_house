export function closeCategoryMenu() {
  document.querySelector("#category-menu").hidden = true;
  document
    .querySelector("#categories-button")
    .setAttribute("aria-expanded", "false");
}
export function initNavigation() {
  const button = document.querySelector("#categories-button");
  const menu = document.querySelector("#category-menu");
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", "category-menu");
  button.addEventListener("click", () => {
    menu.hidden = !menu.hidden;
    button.setAttribute("aria-expanded", String(!menu.hidden));
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest("#category-menu, #categories-button"))
      closeCategoryMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCategoryMenu();
  });
}
