export function bubbleAllTagName(
  element: HTMLElement,
  options: { rootElement?: HTMLElement; tagNames?: string[] } = {},
): string[] {
  const { tagNames = [], rootElement = document.body } = options;

  if (element === rootElement) return tagNames;

  if (element.tagName) tagNames.push(element.tagName);
  console.log(element.tagName);
  return bubbleAllTagName(element.parentElement!, { ...options, tagNames });
}
