import { css, useTheme } from "@emotion/react";
import React, { KeyboardEvent, useCallback, useRef, useState } from "react";

import { Button } from "@/components/Button";
import { getAllParentElements, selectAllChildrenText } from "@/utils/dom";

import {
  AnchorControllerTemplate,
  appendAnchorController,
} from "./AnchorController";
import { TEXT_STATES, TEXT_INDENTS, ANCHOR } from "./constants";
import type { TextControllerTheme } from "./styles";
import { TextController } from "./TextController";
import { TextInput, SelectEventParameters } from "./TextInput";

const textStatesSet = new Set(TEXT_STATES);
const textIndentsSet = new Set(TEXT_INDENTS);

export interface TextEditorProps {
  bottomMode?: boolean;
  onSubmit?: (message: string) => void;
}

export function TextEditor({ bottomMode, onSubmit }: TextEditorProps) {
  const textEditorWrapperRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const anchorControlTemplateRef = useRef<HTMLTemplateElement>(null);

  const [selectedAnchor, setSelectedAnchor] = useState<{
    anchor: HTMLElement;
    anchorController: HTMLElement;
  } | null>(null);
  const [textStates, setTextStates] = useState<typeof TEXT_STATES>([]);
  const [indentState, setIndentState] =
    useState<(typeof TEXT_INDENTS)[number]>("");

  const theme = useTheme() as TextControllerTheme;

  const sendMessage = useCallback(() => {
    if (!textInputRef.current) return;
    const message = textInputRef.current.innerHTML;
    onSubmit?.(message);
    textInputRef.current.innerHTML = "";
  }, [onSubmit]);

  const handleCollapsedSelect = useCallback(
    ({ selection }: SelectEventParameters) => {
      setTextStates([]);
      const text = selection.anchorNode?.textContent || "";
      if (/(^|\n)[-][\s].*/.test(text)) {
        document.execCommand("insertUnorderedList");
        selection.anchorNode!.textContent = text.replace(/[-][\s]+/, "") || "";
        return;
      }
      if (/(^|\n)[\d][.][\s].*/.test(text)) {
        document.execCommand("insertOrderedList");
        selection.anchorNode!.textContent =
          text.replace(/[\d][.][\s]+/, "") || "";
      }
    },
    [],
  );

  const handleNonCollapsedSelect = useCallback(
    ({ event, selection }: SelectEventParameters) => {
      const selectedElementTagNames = getSelectedElementTagNames(
        selection,
        event.target as HTMLElement,
      );
      const textStates = selectedElementTagNames.filter((tagName) =>
        textStatesSet.has(tagName),
      );
      setTextStates(textStates);
    },
    [],
  );

  const handleTextInputSelect = useCallback(
    ({ event, selection }: SelectEventParameters) => {
      const selectedElementTagNames = getSelectedElementTagNames(
        selection,
        event.target as HTMLElement,
      );

      const textIndentElements = selectedElementTagNames.filter((el) =>
        textIndentsSet.has(el),
      );
      setIndentState(textIndentElements[0] || "");
    },
    [],
  );

  const handleTextInputClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const clickedElement = e.target as HTMLElement | null;

      if (clickedElement?.tagName === ANCHOR) {
        if (!anchorControlTemplateRef.current) return;
        if (selectedAnchor?.anchor === clickedElement) {
          selectedAnchor.anchorController.remove();
          return;
        }

        const anchorElement = clickedElement as HTMLAnchorElement;
        selectAllChildrenText(anchorElement);

        const anchorControllerElement = appendAnchorController({
          anchorElement,
          anchorControlTemplateElement: anchorControlTemplateRef.current,
        });
        setSelectedAnchor({
          anchor: anchorElement,
          anchorController: anchorControllerElement,
        });
      } else if (
        selectedAnchor &&
        clickedElement !== selectedAnchor.anchorController
      ) {
        selectedAnchor.anchorController.remove();
        setSelectedAnchor(null);
      }
    },
    [selectedAnchor],
  );

  return (
    <div
      css={css`
        position: relative;
        width: 100%;
        border: ${bottomMode ? "none" : "1px solid"};
        border-color: inherit;
        border-radius: 5px;
        box-sizing: border-box;
      `}
      ref={textEditorWrapperRef}
      onKeyDown={useCallback(
        (e: KeyboardEvent<HTMLDivElement>) => {
          if (e.shiftKey && e.key === "Enter") {
            sendMessage();
          }
        },
        [sendMessage],
      )}
    >
      <TextController textStates={textStates} indentState={indentState} />
      <div
        css={css`
          display: flex;
          min-height: calc(1em + 20px);
          max-height: calc(5em + 20px);
          padding-top: 10px;
          overflow-y: auto;
          background-color: ${theme.backgroundColor};
          color: ${theme.textColor};
        `}
      >
        <TextInput
          ref={textInputRef}
          onCollapsedSelect={handleCollapsedSelect}
          onNonCollapsedSelect={handleNonCollapsedSelect}
          onSelect={handleTextInputSelect}
          onClick={handleTextInputClick}
        />
        <div
          css={css`
            width: 70px;
            min-width: 70px;
            display: flex;
            align-items: center;
            padding: 0 7px;
            box-sizing: border-box;
            padding-bottom: 5px;
          `}
        >
          <Button
            type="button"
            css={css`
              height: 3em;
              background-color: ${theme.backgroundColor2} !important;

              &:hover {
                background-color: ${theme.hoverColor} !important;
              }
            `}
            onClick={useCallback(() => {
              sendMessage();
            }, [sendMessage])}
          >
            📨
          </Button>
        </div>
      </div>
      <AnchorControllerTemplate ref={anchorControlTemplateRef} />
    </div>
  );
}

function getSelectedElementTagNames(
  select: Selection,
  rootElement: HTMLElement,
) {
  const anchorNode = select.anchorNode as HTMLElement;
  const focusNode = select.focusNode as HTMLElement;

  const anchorTagNames = getAllParentElements(anchorNode, { rootElement });
  const endTagNames = getAllParentElements(focusNode, { rootElement });

  const selectedElements = Array.from(
    new Set([...anchorTagNames, ...endTagNames]),
  );

  return selectedElements.map((el) => el.tagName);
}
