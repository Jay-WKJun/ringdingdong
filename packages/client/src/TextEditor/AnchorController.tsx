import { css } from "@emotion/react";
import React, { forwardRef } from "react";

import { Button } from "@/components/Button";

interface AnchorControlProps {}

export const AnchorControllerTemplate = forwardRef<HTMLTemplateElement, AnchorControlProps>((_, ref) => (
  <template ref={ref}>
    <div
      css={css`
        position: absolute;
        top: -100%;
        left: 0;
        display: flex;
        background-color: white;
        padding: 10px;
        gap: 3px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
        border-radius: 10px;
        font-size: 10px;
      `}
    >
      <input
        type="text"
        css={css`
          width: fit-content;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          margin-right: 5px;
        `}
      />
      <Button type="button">📝</Button>
      <Button type="button">⏍</Button>
    </div>
  </template>
));

const clickAwayEventObserver = initClickAwayEvent();

// TODO: 위로 뜨는게 아닌, 글 위에 작은 버튼 올리는 방식으로 변경
export function appendAnchorControl({
  anchorElement,
  anchorControlTemplateElement,
}: {
  anchorElement: HTMLAnchorElement;
  anchorControlTemplateElement: HTMLTemplateElement;
}) {
  const cloneNode = anchorControlTemplateElement.childNodes[0]!.cloneNode(true) as HTMLElement;
  const hrefInput = cloneNode.childNodes[0] as HTMLInputElement;
  // href 값 set
  hrefInput.value = anchorElement.href;

  // 최상위 node에 이벤트 추가
  cloneNode.addEventListener("click", (e) => e.stopPropagation());
  cloneNode.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.stopPropagation();
      anchorElement.setAttribute("href", hrefInput.value);
      clickAwayEventObserver.delete(cloneNode);
    }
  });

  // 수정버튼
  const editButtonElement = cloneNode.childNodes[1] as HTMLButtonElement;
  editButtonElement.addEventListener("click", () => {
    anchorElement.setAttribute("href", hrefInput.value);
    clickAwayEventObserver.delete(cloneNode);
  });

  // 새창버튼
  const newWindowButtonElement = cloneNode.childNodes[2] as HTMLButtonElement;
  newWindowButtonElement.addEventListener("click", () => {
    const href = hrefInput.value;
    window.open(href);
  });

  clickAwayEventObserver.set(cloneNode);
  anchorElement.appendChild(cloneNode);
}

interface ClickAwayEventObserver {
  set(newElement: HTMLElement): void;
  delete(targetElement: HTMLElement): void;
}

function initClickAwayEvent(): ClickAwayEventObserver {
  const tempElements = new Map<HTMLElement, boolean>();

  window.addEventListener("click", (e) => {
    if (!e.target) return;

    if (tempElements.size > 0) {
      Array.from(tempElements.entries()).forEach(([el, isFirst]) => {
        if (isFirst) {
          tempElements.set(el, false);
          return;
        }

        if (e.target !== el) {
          el.remove();
        }
      });
    }
  });

  return {
    set(newElement: HTMLElement) {
      tempElements.set(newElement, true);
    },
    delete(targetElement: HTMLElement) {
      tempElements.delete(targetElement);
      targetElement.remove();
    },
  };
}
