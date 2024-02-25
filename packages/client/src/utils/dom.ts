export function getAllParentElements(
  startElement: HTMLElement,
  options: { rootElement?: HTMLElement } = {},
): HTMLElement[] {
  const { rootElement = document.body } = options;
  const elements: HTMLElement[] = [];

  function bubbleElements(
    finalElement: HTMLElement,
    element?: HTMLElement | null,
  ) {
    if (element === finalElement || !element) return;

    elements.push(element);

    bubbleElements(finalElement, element.parentElement);
  }

  bubbleElements(rootElement, startElement.parentElement);
  return elements;
}

export function selectAllChildrenText(element: HTMLElement) {
  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  range.selectNodeContents(element);
  selection.removeAllRanges();
  selection.addRange(range);
}
