export const customEasing = `cubic-bezier(0.56, 0, 0.3, 1)`;

export const mapElements = (element, object) => {
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

const map = (array, iteratee) => {
  let index = -1;
  const length = array == null ? 0 : array.length;
  const result = new Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
};

export const getMousePos = (e) => {
  let posx = 0;
  let posy = 0;
  if (!e) e = window.event;
  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    posx = e.clientX + body.scrollLeft + document.documentElement.scrollLeft;
    posy = e.clientY + body.scrollTop + document.documentElement.scrollTop;
  }

  return { x: posx, y: posy };
};

export const getOffset = (element, scroll = 0) => {
  const box = element.getBoundingClientRect();

  return {
    bottom: box.bottom,
    height: box.height,
    left: box.left,
    top: box.top + scroll,
    width: box.width,
    y: box.y,
  };
};

export function mapEach(element, callback) {
  if (element instanceof window.HTMLElement) {
    return [callback(element)];
  }

  return map(element, callback);
}

// Linear interpolation
export const lerp = (a, b, n) => (1 - n) * a + n * b;

export const hideScroll = (scrollTop = null) => {
  const body = document.querySelector("body");
  body.classList.add("no-scroll");

  // if (scrollTop) {
  //   body.style = `--top: -${scrollTop}px`;
  // }
};

export const showScroll = (scrollTop) => {
  const body = document.querySelector("body");
  body.classList.remove("no-scroll");
  // body.style = `--top: 0`;

  // scrollTop && window.scrollTo(0, scrollTop);
};
