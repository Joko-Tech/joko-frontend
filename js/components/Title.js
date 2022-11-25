import Animation from "../classes/Animation";
import { mapElements } from "../utils/dom";

export default class extends Animation {
  constructor({ element }) {
    super({
      element,
    });

    this.elements = mapElements(element, {
      innerLine: ".c-line__inner",
    });

    this.onResize();

    if ("IntersectionObserver" in window) {
      this.animateOut();
    }
  }

  textOut() {
    if (!this.elements) return;

    const { innerLine } = this.elements;

    innerLine.forEach((el) => {
      el.style.willChange = "transform";
      el.style.transformStyle = "preserve-3d";
      el.style.transform = "translateY(12vw)";
    });
  }

  textIn() {
    if (!this.elements) return;

    const { innerLine } = this.elements;

    innerLine.forEach((el, index) => {
      el.style.transition = `transform 1s ${index * 0.1}s ease`;

      el.style.transform = "translateY(0)";
    });
  }

  animateIn() {
    if (this.hasAnimatedIn) return;
    super.animateIn();

    this.element.classList.add("in-view");
    this.textIn();

    this.hasAnimatedIn = true;
  }

  animateOut() {
    if (this.hasAnimatedIn) return;
    super.animateOut();

    this.textOut();
  }

  onResize() {}
}
