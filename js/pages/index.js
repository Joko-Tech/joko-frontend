import Component from "../classes/Component";
import InView from "../components/InView";
import Title from "../components/Title";
import { mapEach } from "../utils/dom";

export default class extends Component {
  constructor(element) {
    super({
      element,
      elements: {
        title: '[data-animation="title"]',
        inView: '[data-animation="in-view"]',
      },
    });

    this.createAnimations();
  }

  createAnimations() {
    mapEach(this.elements.title, (element) => {
      return new Title({ element });
    });

    mapEach(this.elements.inView, (element) => {
      return new InView({ element });
    });
  }
}
