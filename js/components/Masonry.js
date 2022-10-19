import Component from "../classes/Component";
import AutoBind from "../utils/bind";

export default class Masonry extends Component {
  constructor({ element }) {
    super({
      element,
      elements: {
        masonry: "[data-masonry]",
        masonryItems: "[data-masonry-item]",
      },
    });

    AutoBind(this);

    this.init();
  }

  generateGrid(columns) {
    const { masonry, masonryItems } = this.elements;
    const columnWrappers = {};

    masonry.innerHTML = "";

    const columnArray = [...Array(columns).keys()];

    columnArray.forEach((column) => {
      const columnWrapper = document.createElement("div");
      columnWrapper.classList.add("c-column");
      columnWrappers[column] = columnWrapper;
    });

    masonryItems.forEach((item, index) => {
      const column = index % columns;
      columnWrappers[column].appendChild(item);

      masonry.appendChild(columnWrappers[column]);
    });
  }

  init() {
    if (this.innerWidth < 600) {
      this.generateGrid(1);
    } else if (this.innerWidth >= 600 && this.innerWidth < 950) {
      this.generateGrid(2);
    } else {
      this.generateGrid(4);
    }

    this.elements.masonry.style.opacity = 1;
  }

  onResize() {
    if (window.innerWidth < 600 && this.innerWidth >= 600) {
      this.generateGrid(1);
    } else if (
      window.innerWidth >= 600 &&
      window.innerWidth < 950 &&
      (this.innerWidth < 600 || this.innerWidth >= 950)
    ) {
      this.generateGrid(2);
    } else if (window.innerWidth >= 950 && this.innerWidth < 950) {
      this.generateGrid(4);
    }
  }
}
