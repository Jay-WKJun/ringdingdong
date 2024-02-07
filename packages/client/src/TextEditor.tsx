import { css } from "@emotion/react";
import React, { useCallback, useRef, useState } from "react";

import { AnchorControllerTemplate, appendAnchorControl } from "./AnchorController";

interface TextEditorProps {}

export function TextEditor({}: TextEditorProps) {
  const textEditorWrapperRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const templateRef = useRef<HTMLTemplateElement>(null);

  const [selectedTextState, setSelectedTextState] = useState("");
  const [indentState, setIndentState] = useState("");

  const sendMessage = () => {
    if (!textInputRef.current) return;

    const message = textInputRef.current.value;
    console.log("send message", message);
    textInputRef.current.value = "";

    // TODO: send message to server
  };

  // TODO: 컨트롤러 보이기 안보이기 설정 (없앨 경우 글을 긁으면 컨트롤러 나오도록 하기)

  // TODO: 선택하면 bold인지 아닌지 판단해서 버튼 활성화 시키기
  console.log("selectedTextState", selectedTextState);
  console.log("indentState", indentState);

  return (
    <div
      css={css`
        position: relative;
        width: 100%;
        height: 100px;
        border: 1px solid #ccc;
        border-radius: 5px;
      `}
      ref={textEditorWrapperRef}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          sendMessage();
        }
      }}
    >
      <div
        css={css`
          display: flex;
          border: none;
        `}
      >
        <button
          type="button"
          onClick={() => {
            document.execCommand("bold");
          }}
        >
          𝐁
        </button>
        <button
          type="button"
          onClick={() => {
            document.execCommand("italic");
          }}
        >
          𝐼
        </button>
        <button
          type="button"
          onClick={() => {
            document.execCommand("strikethrough");
          }}
        >
          ℔
        </button>
        <button
          type="button"
          onClick={() => {
            document.execCommand("underline");
          }}
        >
          ⨱
        </button>
        <button
          type="button"
          onClick={() => {
            const aa = window.prompt("asdf");
            document.execCommand("createLink", false, aa || "https://www.google.com");
          }}
        >
          🔗
        </button>
        <button
          type="button"
          onClick={() => {
            document.execCommand("insertUnorderedList");
          }}
        >
          ●
        </button>
        <button
          type="button"
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
          align-items: center;
        `}
      >
        {/* TODO: contentEditable 되는 걸 컴포넌트화 시켜서기 input처럼 다룰 수기있도록 하기 */}
        {/* TODO: 만들어져 있는 string을 어떻게 여기 넣을 수 있을까? sanitizer에 신경쓰자. */}
        <div
          contentEditable
          css={css`
            position: relative;
            width: 100%;
            height: 80%;
            padding: 10px;
            border: none;
            outline: none;
            box-sizing: border-box;
          `}
          ref={textInputRef}
          onSelect={useCallback((e: React.SyntheticEvent<HTMLDivElement, Event>) => {
            if (!window) return;

            const selection = window.getSelection();
            if (selection?.isCollapsed) {
              setSelectedTextState("");
              const text = selection?.anchorNode?.textContent || "";
              // TODO: 별도의 함수로 리팩토링
              if (/^[-][\s].*/.test(text)) {
                selection!.anchorNode!.textContent = text.replace(/^[-][\s]+/, "") || "";
                document.execCommand("insertUnorderedList");
                return;
              }
              if (/^[\d][.][\s].*/.test(text)) {
                selection!.anchorNode!.textContent = text.replace(/^[\d][.][\s]+/, "") || "";
                document.execCommand("insertOrderedList");
              }
            } else {
              const anchorParentTagName = selection?.anchorNode?.parentElement?.tagName;
              const focusParentTagName = selection?.focusNode?.parentElement?.tagName;
              if (anchorParentTagName && focusParentTagName && anchorParentTagName === focusParentTagName) {
                setSelectedTextState(anchorParentTagName);
              } else {
                setSelectedTextState("");
              }
            }

            if (selection?.anchorNode) {
              recurseParentElement(selection.anchorNode as HTMLElement);
            }

            function recurseParentElement(element: HTMLElement) {
              if (element === e.target) {
                setIndentState("");
                return;
              }
              if (element.tagName === "UL") {
                setIndentState("UL");
                return;
              }
              if (element.tagName === "OL") {
                setIndentState("OL");
                return;
              }
              recurseParentElement(element.parentElement!);
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
        <button
          type="button"
          onClick={() => {
            sendMessage();
          }}
        >
          Send
        </button>
      </div>
      <AnchorControllerTemplate ref={templateRef} />
    </div>
  );
}
