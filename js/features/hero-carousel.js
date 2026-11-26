// Hero rotation is independent of the catalogue and the Friday Market advert.
export function initHeroCarousel(
  root = document.querySelector("[data-hero-carousel]"),
) {
  const slides = [...(root?.querySelectorAll?.("[data-hero-slide]") ?? [])];
  if (slides.length < 2) return;

  const selectors = [...root.querySelectorAll("[data-hero-select]")];
  const previousButton = root.querySelector("[data-hero-previous]");
  const nextButton = root.querySelector("[data-hero-next]");
  const motion = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)");
  let current = 0;
  let paused = motion?.matches ?? false;
  let hovered = false;
  let focused = false;
  let timer;

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
      slide.inert = !active;
    });
    selectors.forEach((button, i) => {
      button.setAttribute("aria-pressed", String(i === current));
    });
  }

  function schedule() {
    clearInterval(timer);
    if (paused || hovered || focused || document.hidden) return;
    timer = setInterval(() => {
      // Keep the first banner available while the arrival advert is open.
      if (!document.querySelector("dialog[open]")) show(current + 1);
    }, 7_000);
  }

  selectors.forEach((button, index) => {
    button.addEventListener("click", () => {
      show(index);
      schedule();
    });
  });
  previousButton.addEventListener("click", () => {
    show(current - 1);
    schedule();
  });
  nextButton.addEventListener("click", () => {
    show(current + 1);
    schedule();
  });
  root.addEventListener("mouseenter", () => {
    hovered = true;
    schedule();
  });
  root.addEventListener("mouseleave", () => {
    hovered = false;
    schedule();
  });
  root.addEventListener("focusin", () => {
    focused = true;
    schedule();
  });
  root.addEventListener("focusout", (event) => {
    focused = root.contains(event.relatedTarget);
    schedule();
  });
  document.addEventListener("visibilitychange", schedule);
  motion?.addEventListener("change", (event) => {
    paused = event.matches;
    schedule();
  });

  show(0);
  root.querySelector(".hero-controls").hidden = false;
  previousButton.hidden = false;
  nextButton.hidden = false;
  schedule();
}
