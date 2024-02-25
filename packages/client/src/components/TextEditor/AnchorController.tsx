import { css } from "@emotion/react";
import React, { forwardRef } from "react";

import { Button } from "@/components/Button";

interface AnchorControllerProps {}

export const AnchorControllerTemplate = forwardRef<
  HTMLTemplateElement,
  AnchorControllerProps
>((_, ref) => (
  <template ref={ref}>
    <div
      css={css`
        position: absolute;
        top: 50%;
        left: 50%;
        display: flex;
        background-color: white;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
        box-sizing: border-box;
        border-radius: 10px;
        font-size: 1em;
        z-index: 1;
        transform: translate(-50%, -50%);
      `}
    >
      <Button
        type="button"
        css={css`
          padding: 0.1em 0.2em;
          font-size: 1em;
        `}
      >
        ⏍
      </Button>
    </div>
  </template>
));

export function appendAnchorController({
  anchorElement,
  anchorControlTemplateElement,
}: {
  anchorElement: HTMLAnchorElement;
  anchorControlTemplateElement: HTMLTemplateElement;
}) {
  const cloneNode = anchorControlTemplateElement.childNodes[0]!.cloneNode(
    true,
  ) as HTMLElement;
  const hrefInput = cloneNode.childNodes[0] as HTMLInputElement;
  // href 값 set
  hrefInput.value = anchorElement.href;

  // 최상위 node에 이벤트 추가
  cloneNode.addEventListener("click", (e) => e.stopPropagation());

  // 새창버튼
  const newWindowButtonElement = cloneNode.childNodes[0] as HTMLButtonElement;
  newWindowButtonElement.addEventListener("click", () => {
    const href = hrefInput.value;
    window.open(href);
  });

  anchorElement.appendChild(cloneNode);

  return cloneNode;
}
