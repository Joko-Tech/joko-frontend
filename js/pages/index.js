import Component from "../classes/Component";
import Title from "../components/Title";
import { mapEach } from "../utils/dom";

export default class extends Component {
  constructor(element) {
    super({
      element,
      elements: {
        title: '[data-animation="title"]',
      },
    });

    this.createAnimations();
  }

  createAnimations() {
    mapEach(this.elements.title, (element) => {
      return new Title({ element });
    });
  }
}
