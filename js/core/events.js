// Delegate actions so newly rendered cards and dialogs need no rebinding.
export function onAction(selector, handler, root = document) {
  root.addEventListener("click", (event) => {
    const target = event.target.closest(selector);
    if (target) handler(target, event);
  });
}
