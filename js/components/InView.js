import Animation from "../classes/Animation";

export default class extends Animation {
  constructor({ element }) {
    super({
      element,
    });

    this.onResize();

    if ("IntersectionObserver" in window) {
      this.animateOut();
    }
  }

  animateIn() {
    if (this.hasAnimatedIn) return;
    super.animateIn();

    this.element.classList.add("in-view");

    this.hasAnimatedIn = true;
  }

  animateOut() {
    if (this.hasAnimatedIn) return;
    super.animateOut();
  }

  onResize() {}
}
