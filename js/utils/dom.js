const map = (array, iteratee) => {
  let index = -1;
  const length = array == null ? 0 : array.length;
  const result = new Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
};

export const findAncestor = (element, selector) => {
  while (
    (element = element.parentElement) &&
    !(element.matches || element.matchesSelector).call(element, selector)
  ) {
    return element;
  }
};

export const getOffset = (element, scroll = 0) => {
  const box = element.getBoundingClientRect();

  return {
    bottom: box.bottom,
    height: box.height,
    left: box.left,
    top: box.top + scroll,
    width: box.width,
  };
};

export function getIndex(node) {
  let index = 0;

  while ((node = node.previousElementSibling)) {
    index++;
  }

  return index;
}

export function mapEach(element, callback) {
  if (element instanceof window.HTMLElement) {
    return [callback(element)];
  }

  return map(element, callback);
}

export const mapElements = (element, object) => {
  if (element instanceof HTMLElement) {
    element = element;
  } else {
    element = document.querySelector(element);
  }

  const elements = {};

  Object.keys(object).forEach((key) => {
    const entry = object[key];

    if (
      entry instanceof HTMLElement ||
      entry instanceof NodeList ||
      Array.isArray(entry)
    ) {
      elements[key] = entry;
    } else {
      elements[key] = element.querySelectorAll(entry);

      if (elements[key].length === 0) {
        elements[key] = null;
      } else if (elements[key].length === 1) {
        elements[key] = element.querySelector(entry);
      }
    }
  });

  return elements;
};

export const flip = (from, to) => {
  const fromOffset = getOffset(from);
  const toOffset = getOffset(to);

  const x = toOffset.left - fromOffset.left;
  const y = toOffset.top - fromOffset.top;
  const scale = toOffset.width / fromOffset.width;

  return {
    x,
    y,
    scale,
  };
};
