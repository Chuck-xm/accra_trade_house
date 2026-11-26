import { test } from "node:test";
import assert from "node:assert/strict";
import { initHeroCarousel } from "../js/features/hero-carousel.js";

function control() {
  return {
    attributes: {},
    listeners: {},
    hidden: true,
    classList: {
      toggle(name, active) {
        this[name] = active;
      },
    },
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
    addEventListener(type, callback) {
      this.listeners[type] = callback;
    },
  };
}

test("hero rotates three banners every 7 seconds and supports playback controls", () => {
  const slides = Array.from({ length: 3 }, control);
  const selectors = Array.from({ length: 3 }, control);
  const previous = control();
  const next = control();
  const controls = control();
  const root = control();
  root.querySelectorAll = (selector) =>
    selector === "[data-hero-slide]" ? slides : selectors;
  root.querySelector = (selector) =>
    ({
      "[data-hero-previous]": previous,
      "[data-hero-next]": next,
      ".hero-controls": controls,
    })[selector];
  root.contains = (target) => target === previous;
  const timers = new Map();
  let timerId = 0;
  let modalOpen = false;
  let reducedMotion = false;
  const motion = control();
  Object.defineProperty(motion, "matches", { get: () => reducedMotion });
  const old = {
    document: globalThis.document,
    matchMedia: globalThis.matchMedia,
    setInterval: globalThis.setInterval,
    clearInterval: globalThis.clearInterval,
  };
  const doc = control();
  doc.hidden = false;
  doc.querySelector = () => (modalOpen ? {} : null);
  globalThis.document = doc;
  globalThis.matchMedia = () => motion;
  globalThis.setInterval = (callback, delay) => {
    assert.equal(delay, 7_000);
    timers.set(++timerId, callback);
    return timerId;
  };
  globalThis.clearInterval = (id) => timers.delete(id);
  const advance = () => [...timers.values()].forEach((callback) => callback());
  const active = () => slides.findIndex((slide) => !slide.inert);
  try {
    initHeroCarousel(root);
    assert.equal(controls.hidden, false);
    assert.equal(active(), 0);
    assert.equal(previous.hidden, false);
    assert.equal(next.hidden, false);
    previous.listeners.click();
    assert.equal(active(), 2);
    next.listeners.click();
    assert.equal(active(), 0);
    advance();
    assert.equal(active(), 1);
    advance();
    assert.equal(active(), 2);
    advance();
    assert.equal(active(), 0);
    assert.equal(slides[1].attributes["aria-hidden"], "true");
    selectors[2].listeners.click();
    assert.equal(active(), 2);
    assert.equal(selectors[2].attributes["aria-pressed"], "true");
    advance();
    assert.equal(active(), 0);
    root.listeners.mouseenter();
    advance();
    assert.equal(active(), 0);
    root.listeners.mouseleave();
    advance();
    assert.equal(active(), 1);
    root.listeners.focusin();
    advance();
    assert.equal(active(), 1);
    root.listeners.focusout({ relatedTarget: null });
    modalOpen = true;
    advance();
    assert.equal(active(), 1);
    modalOpen = false;
    advance();
    assert.equal(active(), 2);
    doc.hidden = true;
    doc.listeners.visibilitychange();
    advance();
    assert.equal(active(), 2);
    doc.hidden = false;
    doc.listeners.visibilitychange();
    advance();
    assert.equal(active(), 0);
    reducedMotion = true;
    motion.listeners.change({ matches: true });
    advance();
    assert.equal(active(), 0);
    selectors[1].listeners.click();
    assert.equal(active(), 1);
  } finally {
    Object.assign(globalThis, old);
  }
});
