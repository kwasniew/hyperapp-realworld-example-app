import {
  fireEvent
} from "dom-testing-library";

export function element(selector) {
  return function predicate() {
    return document.querySelector(selector);
  };
}

export function elements(selector, value, n) {
  return function predicate() {
    if (n == null) {
      return Array.from(document.querySelectorAll(selector)).filter(
        element => element.innerHTML === value
      );
    }
    return (
      Array.from(document.querySelectorAll(selector)).filter(
        element => element.innerHTML === value
      ).length === n
    );
  };
}

export function elementWithValue(selector, value) {
  return function predicate() {
    return Array.from(document.querySelectorAll(selector)).find(
      element => element.innerHTML === value
    );
  };
}

export const click = predicate => {
  const element = typeof predicate === "function" ? predicate() : predicate;
  fireEvent.click(element);
  return element;
};
export const type = (predicate, value) => {
  const element = typeof predicate === "function" ? predicate() : predicate;
  element.value = value;

  fireEvent.input(element);
};

export const enter = predicate => {
  const element = typeof predicate === "function" ? predicate() : predicate;
  fireEvent.keyUp(element, { key: "Enter", keyCode: 13 });
  return element;
};