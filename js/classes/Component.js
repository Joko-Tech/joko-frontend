import AutoBind from "../utils/bind";

export default class Component {
  constructor({ element, elements }) {
    AutoBind(this);

    this.mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    this.addEventListeners();

    this.selector = element;
    this.selectorChildren = { ...elements };
    this.create();
    this.innerWidth = window.innerWidth;
    this.onResize();
  }

  create() {
    if (this.selector instanceof HTMLElement) {
      this.element = this.selector;
    } else {
      this.element = document.querySelector(this.selector);
    }

    this.elements = {};

    Object.keys(this.selectorChildren).forEach((key) => {
      const entry = this.selectorChildren[key];

      if (
        entry instanceof HTMLElement ||
        entry instanceof NodeList ||
        Array.isArray(entry)
      ) {
        this.elements[key] = entry;
      } else {
        this.elements[key] = this.element.querySelectorAll(entry);

        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = this.element.querySelector(entry);
        }
      }
    });
  }

  // update() {
  //   this.animationFrame = window.requestAnimationFrame(this.update);
  // }

  // destroy() {
  //   window.cancelAnimationFrame(this.animationFrame);
  // }

  /**
   * Events
   */

  onResize() {}

  onScroll(event) {}

  addEventListeners() {
    // window.addEventListener("scroll", this.onScroll, { passive: true });
    // finish load event
    // window.addEventListener("load", this.onResize, { passive: true });

    window.addEventListener(
      "resize",
      () => {
        // Safari check
        if (this.innerWidth === window.innerWidth) return;
        this.onResize();
        this.innerWidth = window.innerWidth;
      },
      { passive: true }
    );
  }
}
