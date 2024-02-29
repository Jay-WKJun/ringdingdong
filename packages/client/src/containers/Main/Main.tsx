import { css, useTheme } from "@emotion/react";
import React, { useCallback, useRef } from "react";

import { TextEditor } from "@/components";
import { useAppGlobal, useSetPathContext } from "@/contexts";
import { useModal } from "@/hooks";
import type { TalkToMeTheme } from "@/styles";

export function Main() {
  const idRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { openModal, closeModal, Modal } = useModal();
  const {
    openModal: openNewThreadModal,
    closeModal: closeNewThreadModal,
    Modal: NewThreadModal,
  } = useModal();

  const { apis, localStorageService } = useAppGlobal();
  const setPath = useSetPathContext();

  const theme = useTheme() as TalkToMeTheme;

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!apis) return;

      const id = idRef.current?.value;
      const password = passwordRef.current?.value;

      if (!id) {
        alert("Please input your id");
        return;
      }

      if (!password) {
        alert("Please input your password");
        return;
      }

      apis
        .getRefreshToken({ id, password })
        .then((res) => {
          localStorageService?.setLocalStorage(res);
        })
        .catch(() => {
          openModal();
        });
    },
    [apis, localStorageService, openModal],
  );

  return (
    <main
      css={css`
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        overflow: hidden;
        background-color: ${theme.backgroundColor};
      `}
    >
      <form
        css={css`
          max-width: 600px;
          min-width: 200px;
          max-height: 700px;
          min-height: 300px;
          width: 100%;
          height: 100%;
          margin: auto;
          padding: 10px 20px;
          border-radius: 10px;
          background-color: ${theme.backgroundColor};
          box-shadow: 0 0 20px 0 ${theme.boxShadowColor};
        `}
        onSubmit={handleSubmit}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 30px;
            width: 100%;
            height: 100%;
          `}
        >
          <h1>😁</h1>
          <div
            css={css`
              width: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              gap: 20px;
            `}
          >
            <input
              type="text"
              placeholder="Your Id"
              css={css`
                padding: 10px 20px;
                border-radius: 30px;
                box-shadow: 0 0 10px 0 ${theme.boxShadowColor};
              `}
              ref={idRef}
            />
            <input
              type="password"
              placeholder="Password"
              css={css`
                padding: 10px 20px;
                border-radius: 30px;
                box-shadow: 0 0 10px 0 ${theme.boxShadowColor};
              `}
              ref={passwordRef}
            />
          </div>
          <button
            type="submit"
            css={css`
              width: 100%;
              max-width: 200px;
              height: 50px;
              padding: 10px 20px;
              border-radius: 30px;
              box-shadow: 0 0 10px 0 ${theme.boxShadowColor};
            `}
          >
            {`Let's Go 😎`}
          </button>
        </div>
      </form>

      <Modal
        modalCss={css`
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
        `}
      >
        <div
          css={css`
            width: 100%;
            max-width: 400px;
            height: 100%;
            max-height: 250px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: ${theme.backgroundColor};
            border-radius: 30px;
          `}
        >
          <h1>User not exist</h1>

          <button
            type="button"
            css={css`
              padding: 10px 20px;
              border-radius: 30px;
              font-weight: bold;
              font-size: 16px;
              margin-bottom: 20px;
              box-shadow: 0 0 7px 0 ${theme.boxShadowColor};
            `}
            onClick={() => {
              closeModal();
              openNewThreadModal();
            }}
          >
            Create New one! 🎉
          </button>
          <button
            type="button"
            css={css`
              padding: 10px 20px;
              border-radius: 30px;
              font-weight: bold;
              font-size: 16px;
              box-shadow: 0 0 7px 0 ${theme.boxShadowColor};
            `}
            onClick={closeModal}
          >
            close
          </button>
        </div>
      </Modal>

      <NewThreadModal
        keepOpen
        modalCss={css`
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
        `}
      >
        <div
          css={css`
            max-width: 600px;
            min-width: 200px;
            max-height: 700px;
            min-height: 300px;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: ${theme.backgroundColor};
            border-radius: 30px;
          `}
        >
          <div
            css={css`
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 100%;
              max-width: 500px;
              max-height: 400px;
            `}
          >
            <h1>🎉 New Thread!</h1>
            <h3>Introduce Yourself!</h3>
            <TextEditor
              onSubmit={(description) => {
                const id = idRef.current?.value;
                const password = passwordRef.current?.value;
                if (!id || !password || !setPath) return;

                apis
                  .postUser({ id, password, description })
                  .then((res) => {
                    localStorageService?.setLocalStorage(res);
                    closeNewThreadModal();
                    setPath("chat");
                  })
                  .catch(() => {
                    alert("Failed to create new thread");
                  });
              }}
            />
            <button
              type="button"
              css={css`
                padding: 20px;
                border-radius: 30px;
                width: 50%;
                margin-top: 30px;
                font-weight: bold;
                font-size: 16px;
                box-shadow: 0 0 7px 0 ${theme.boxShadowColor};
              `}
              onClick={closeNewThreadModal}
            >
              cancel
            </button>
          </div>
        </div>
      </NewThreadModal>
    </main>
  );
}
