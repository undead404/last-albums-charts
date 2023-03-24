export interface ElementOptions {
  attributes?: Record<string, string>;
  classes?: string[];
  dataset?: DOMStringMap,
  style?: Partial<CSSStyleDeclaration>;
  textContent?: string;
}

export default function createElement(
  tagName: string,
  { attributes, classes, dataset, style, textContent }: ElementOptions,
) {
  const element = document.createElement(tagName);
  setupAttributes(element, attributes);
  setupClasses(element, classes);
  setupDataset(element, dataset);
  setupStyle(element, style);
  if (textContent) {
    element.textContent = textContent;
  }
  return element;
}

function setupAttributes(
  element: HTMLElement,
  attributes: ElementOptions['attributes'],
) {
  if (!attributes) {
    return;
  }
  for (const attributeName in attributes) {
    const value = attributes[attributeName];
    if (typeof value === 'undefined') {
      continue;
    }
    if (value === null) {
      element.removeAttribute(attributeName);
    } else {
      element.setAttribute(attributeName, value);
    }
  }
}

function setupClasses(
  element: HTMLElement,
  classes: ElementOptions['classes'],
) {
  if (!classes) {
    return;
  }
  for (const className of classes) {
    element.classList.add(className);
  }
}
function setupDataset(element: HTMLElement, dataset: ElementOptions['dataset']) {
  if(!dataset) {
    return;
  }
  for (const key in dataset) {
    element.dataset[key] = dataset[key];
  }
}

function setupStyle(element: HTMLElement, style: ElementOptions['style']) {
  if (!style) {
    return;
  }
  for (const property in style) {
    element.style[property] = style[property] || '';
  }
}
