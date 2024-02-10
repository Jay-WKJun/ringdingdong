import { css } from "@emotion/react";
import React, { useCallback, useRef, useState } from "react";

import { AnchorControllerTemplate, appendAnchorControl } from "./AnchorController";
import { bubbleAllTagName } from "./utils/dom";

interface TextEditorProps {
  onSubmit?: (message: string) => void;
}

export function TextEditor({ onSubmit }: TextEditorProps) {
  const textEditorWrapperRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const templateRef = useRef<HTMLTemplateElement>(null);

  // TODO: STATE들 Constants로 빼기
  const [selectedTextStates, setSelectedTextStates] = useState<string[]>([]);
  const [indentState, setIndentState] = useState("");

  const sendMessage = () => {
    if (!textInputRef.current) return;
    const message = textInputRef.current.innerHTML;
    onSubmit?.(message);
    console.log("message", message);
    // TODO: 초기화 어케함? sanitizing도 신경쓰자.
    textInputRef.current.innerHTML = "";

    // TODO: send message to server
  };

  // TODO: 컨트롤러 보이기 안보이기 설정 (없앨 경우 글을 긁으면 컨트롤러 나오도록 하기)

  return (
    <div
      css={css`
        position: relative;
        width: 100%;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box;
      `}
      ref={textEditorWrapperRef}
      onKeyDown={(e) => {
        if (e.shiftKey && e.key === "Enter") {
          sendMessage();
        }
      }}
    >
      <div
        css={css`
          display: flex;
          gap: 5px;
          border: none;
          background-color: #f9f9f9f9;
          padding: 5px 3px;
          border-radius: 5px;
          overflow: hidden;
          box-sizing: border-box;
          margin-bottom: 5px;

          button {
            flex: 1;
            padding: 0.3em;
            border: none;
            cursor: pointer;

            &:hover {
              background-color: #e0e0e0;
            }
          }
        `}
      >
        <button
          type="button"
          css={css`
            background-color: ${selectedTextStates.includes("B") ? "lightgray" : "#f9f9f9"};
          `}
          onClick={() => {
            document.execCommand("bold");
          }}
        >
          𝐁
        </button>
        <button
          type="button"
          css={css`
            background-color: ${selectedTextStates.includes("I") ? "lightgray" : "#f9f9f9"};
          `}
          onClick={() => {
            document.execCommand("italic");
          }}
        >
          𝐼
        </button>
        <button
          type="button"
          css={css`
            background-color: ${selectedTextStates.includes("STRIKE") ? "lightgray" : "#f9f9f9"};
          `}
          onClick={() => {
            document.execCommand("strikethrough");
          }}
        >
          ℔
        </button>
        <button
          type="button"
          css={css`
            background-color: ${selectedTextStates.includes("U") ? "lightgray" : "#f9f9f9"};
          `}
          onClick={() => {
            document.execCommand("underline");
          }}
        >
          ⨱
        </button>
        <button
          type="button"
          css={css`
            background-color: ${selectedTextStates.includes("A") ? "lightgray" : "#f9f9f9"};
          `}
          onClick={() => {
            const isLinked = selectedTextStates.includes("A");
            if (isLinked) {
              document.execCommand("unlink");
              return;
            }

            const aa = window.prompt("asdf");
            document.execCommand("createLink", false, aa || "https://www.google.com");
          }}
        >
          🔗
        </button>
        <button
          type="button"
          css={css`
            background-color: ${indentState === "UL" ? "lightgray" : "#f9f9f9"};
          `}
          onClick={() => {
            document.execCommand("insertUnorderedList");
          }}
        >
          ●
        </button>
        <button
          type="button"
          css={css`
            background-color: ${indentState === "OL" ? "lightgray" : "#f9f9f9"};
          `}
          onClick={() => {
            document.execCommand("insertUnorderedList");
          }}
        >
          №
        </button>
      </div>
      <div
        css={css`
          display: flex;
          min-height: calc(1em + 20px);
          max-height: calc(5em + 20px);
          overflow-y: auto;
        `}
      >
        {/* TODO: contentEditable 되는 걸 컴포넌트화 시켜서기 input처럼 다룰 수기있도록 하기 */}
        {/* TODO: 만들어져 있는 string을 어떻게 여기 넣을 수 있을까? sanitizer에 신경쓰자. */}
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
          ref={textInputRef}
          onSelect={useCallback((e: React.SyntheticEvent<HTMLDivElement, Event>) => {
            if (!window) return;

            const selection = window.getSelection();
            if (!selection) return;

            if (selection.isCollapsed) {
              setSelectedTextStates([]);
              const text = selection.anchorNode?.textContent || "";
              // -, 1. 했을 떄, 리스트 만들어주는 곳
              // TODO: 별도의 함수로 리팩토링
              if (/(^|\n)[-][\s].*/.test(text)) {
                document.execCommand("insertUnorderedList");
                selection.anchorNode!.textContent = text.replace(/[-][\s]+/, "") || "";
                return;
              }
              if (/(^|\n)[\d][.][\s].*/.test(text)) {
                document.execCommand("insertOrderedList");
                selection.anchorNode!.textContent = text.replace(/[\d][.][\s]+/, "") || "";
              }
            } else {
              const richTextStates = getRichTextStates(
                selection,
                e.target as HTMLElement,
                new Set(["B", "I", "U", "STRIKE", "A"]),
              );
              setSelectedTextStates(richTextStates);
            }

            if (selection.anchorNode && selection.focusNode) {
              const aa = getRichTextStates(selection, e.target as HTMLElement, new Set(["UL", "OL"]));
              setIndentState(aa[0] || "");
            }
          }, [])}
          onClick={(e) => {
            const clickTargetElement = e.target as HTMLElement | null;
            if (clickTargetElement?.tagName === "A") {
              if (!templateRef.current) return;
              const anchorElement = clickTargetElement as HTMLAnchorElement;
              appendAnchorControl({ anchorElement, templateElement: templateRef.current });
            }
          }}
        />
        <div
          css={css`
            width: 30%;
            min-width: 70px;
            display: flex;
            align-items: center;
            padding: 0 7px;
            box-sizing: border-box;
            padding-bottom: 5px;
          `}
        >
          <button
            type="button"
            css={css`
              height: 3em;
            `}
            onClick={() => {
              sendMessage();
            }}
          >
            📨
          </button>
        </div>
      </div>
      <AnchorControllerTemplate ref={templateRef} />
    </div>
  );
}

function getRichTextStates(select: Selection, rootElement: HTMLElement, selectedTagNames?: Set<string>) {
  const anchorNode = select.anchorNode as HTMLElement;
  const focusNode = select.focusNode as HTMLElement;

  const anchorTagNames = bubbleAllTagName(anchorNode, { rootElement });
  const endTagNames = bubbleAllTagName(focusNode, { rootElement });

  const richTextStates: string[] = Array.from(new Set([...anchorTagNames, ...endTagNames])).filter(
    (state) => selectedTagNames?.has(state),
  );

  return richTextStates;
}
