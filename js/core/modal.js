const modal = document.querySelector("#modal");
export const content = document.querySelector("#modal-content");
let focusBeforeModal;
export function showModal(html, { className = "" } = {}) {
  if (!modal.open) focusBeforeModal = document.activeElement;
  modal.className = className;
  content.innerHTML = html;
  if (!modal.open) modal.showModal();
  modal.scrollTop = 0;
}
export function closeModal() {
  modal.close();
}
export function initModal() {
  modal.querySelector(".modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target !== modal) return;
    const box = modal.getBoundingClientRect();
    if (
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom
    )
      closeModal();
  });
  modal.addEventListener("close", () => focusBeforeModal?.focus());
}
