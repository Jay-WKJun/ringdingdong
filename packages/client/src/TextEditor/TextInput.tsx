import { css } from "@emotion/react";
import { forwardRef, useCallback, SyntheticEvent, MouseEvent as ReactMouseEvent, memo } from "react";
import sanitizeHTML from "sanitize-html";

import { Parser } from "../utils/parser";

export interface SelectEventParameters {
  event: SyntheticEvent<HTMLDivElement, Event>;
  selection: Selection;
}

interface TextInputProps {
  initText?: string;
  onCollapsedSelect?: (param: SelectEventParameters) => void;
  onNonCollapsedSelect?: (param: SelectEventParameters) => void;
  onSelect?: (param: SelectEventParameters) => void;
  onClick?: (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const TextInputComponent = forwardRef<HTMLDivElement, TextInputProps>(
  ({ initText, onCollapsedSelect, onNonCollapsedSelect, onSelect, onClick }, ref) => {
    const handleInputSelect = useCallback(
      (e: SyntheticEvent<HTMLDivElement, Event>) => {
        if (!window) return;

        const selection = window.getSelection();
        if (!selection) return;

        if (selection.isCollapsed) {
          onCollapsedSelect?.({ event: e, selection });
        } else {
          onNonCollapsedSelect?.({ event: e, selection });
        }

        if (selection.anchorNode && selection.focusNode) {
          onSelect?.({ event: e, selection });
        }
      },
      [onCollapsedSelect, onNonCollapsedSelect, onSelect],
    );

    return (
      <div
        contentEditable
        suppressContentEditableWarning
        css={css`
          position: relative;
          width: 100%;
          height: fit-content;
          padding: 10px;
          border: none;
          outline: none;
          box-sizing: border-box;
        `}
        ref={ref}
        onSelect={handleInputSelect}
        onClick={onClick}
        onPaste={async (e) => {
          e.preventDefault();

          // 이미 적혀있는 내용물을 가져오고, 어디에 select 되어있는지 파악해서 문자열에 splice
          const selection = window.getSelection();
          if (!selection) return;

          // TODO: Text 이외의 것도 처리할 수 있도록 수정
          const clippedText = await navigator.clipboard.readText();
          const sanitizedHTMLText = sanitizeHTML(clippedText);

          if (selection.isCollapsed) {
            document.execCommand("insertHTML", false, sanitizedHTMLText);
          } else {
            document.execCommand("insertHTML", false, sanitizedHTMLText);
          }
        }}
      >
        {Parser.parse(initText)}
      </div>
    );
  },
);

export const TextInput = memo(TextInputComponent);
