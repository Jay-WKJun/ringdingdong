import { css } from "@emotion/react";
import React, { KeyboardEvent, useCallback, useRef, useState } from "react";

import { Button } from "@/components/Button";
import { bubbleAllTagName } from "@/utils/dom";

import {
  AnchorControllerTemplate,
  appendAnchorControl,
} from "./AnchorController";
import { TEXT_STATES, TEXT_INDENTS, ANCHOR } from "./constants";
import { TextController } from "./TextController";
import { TextInput, SelectEventParameters } from "./TextInput";

interface TextEditorProps {
  bottomMode?: boolean;
  onSubmit?: (message: string) => void;
}

export function TextEditor({ bottomMode, onSubmit }: TextEditorProps) {
  const textEditorWrapperRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const anchorControlTemplateRef = useRef<HTMLTemplateElement>(null);

  // TODO: 컨트롤러 보이기 안보이기 설정 (없앨 경우 글을 긁으면 컨트롤러 나오도록 하기)

  const [textStates, setTextStates] = useState<typeof TEXT_STATES>([]);
  const [indentState, setIndentState] =
    useState<(typeof TEXT_INDENTS)[number]>("");

  const sendMessage = useCallback(() => {
    if (!textInputRef.current) return;
    const message = textInputRef.current.innerHTML;
    onSubmit?.(message);
    console.log("message", message);
    textInputRef.current.innerHTML = "";

    // TODO: send message to server
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
      const textStateElements = getTextStateElements(
        selection,
        event.target as HTMLElement,
        new Set(TEXT_STATES),
      );
      setTextStates(textStateElements);
    },
    [],
  );

  const handleTextInputSelect = useCallback(
    ({ event, selection }: SelectEventParameters) => {
      const textIndentElements = getTextStateElements(
        selection,
        event.target as HTMLElement,
        new Set(TEXT_INDENTS),
      );
      setIndentState(textIndentElements[0] || "");
    },
    [],
  );

  const handleTextInputClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const clickTargetElement = e.target as HTMLElement | null;
      if (clickTargetElement?.tagName === ANCHOR) {
        if (!anchorControlTemplateRef.current) return;
        const anchorElement = clickTargetElement as HTMLAnchorElement;
        appendAnchorControl({
          anchorElement,
          anchorControlTemplateElement: anchorControlTemplateRef.current,
        });
      }
    },
    [],
  );

  return (
    <div
      css={css`
        position: relative;
        width: 100%;
        border: ${bottomMode ? "none" : "1px solid #ccc"};
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
          overflow-y: auto;
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

function getTextStateElements(
  select: Selection,
  rootElement: HTMLElement,
  selectedTagNames?: Set<string>,
) {
  const anchorNode = select.anchorNode as HTMLElement;
  const focusNode = select.focusNode as HTMLElement;

  const anchorTagNames = bubbleAllTagName(anchorNode, { rootElement });
  const endTagNames = bubbleAllTagName(focusNode, { rootElement });

  const textElements: string[] = Array.from(
    new Set([...anchorTagNames, ...endTagNames]),
  ).filter((state) => selectedTagNames?.has(state));

  return textElements;
}
