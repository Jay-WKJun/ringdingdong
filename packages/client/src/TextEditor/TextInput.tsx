import { css } from "@emotion/react";
import { forwardRef, useCallback, SyntheticEvent, MouseEvent as ReactMouseEvent } from "react";

export interface SelectEventParameters {
  event: SyntheticEvent<HTMLDivElement, Event>;
  selection: Selection;
}

interface TextInputProps {
  onCollapsedSelect?: (param: SelectEventParameters) => void;
  onNonCollapsedSelect?: (param: SelectEventParameters) => void;
  onSelect?: (param: SelectEventParameters) => void;
  onClick?: (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export const TextInput = forwardRef<HTMLDivElement, TextInputProps>(
  ({ onCollapsedSelect, onNonCollapsedSelect, onSelect, onClick }, ref) => {
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
      />
    );
  },
);
