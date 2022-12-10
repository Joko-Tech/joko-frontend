import Animation from "../classes/Animation";
import { mapElements } from "../utils/dom";
import { preloadImage } from "../utils/image";

export default class extends Animation {
  constructor(element) {
    super({
      element,
    });

    this.elements = mapElements(element, {
      image: "img",
      video: "video",
      loader: ".c-loader",
    });

    this.onResize();

    if ("IntersectionObserver" in window) {
      this.animateOut();
    }

    // console.log("ImageLazyLoader", this.elements);
  }

  async animateIn() {
    if (this.hasAnimatedIn) return;

    const { image, video } = this.elements;

    if (image) {
      const dataSrc = image.getAttribute("pre-src");

      if (dataSrc) {
        const src = dataSrc;
        await preloadImage(src);

        image.src = src;
        image.removeAttribute("pre-src");

        setTimeout(() => {
          this.element.classList.add("loaded");
        }, 500);
      }
    }

    if (video) {
      const dataSrc = video.getAttribute("pre-src");

      if (dataSrc) {
        video.setAttribute("src", dataSrc);
        video.removeAttribute("pre-src");

        setTimeout(() => {
          this.element.classList.add("loaded");
        }, 500);
      }
    }

    this.hasAnimatedIn = true;
  }

  animateOut() {
    if (this.hasAnimatedIn) return;
  }

  onResize() {}
}
