import { css } from "@emotion/react";
import React, { useCallback } from "react";

import { useModal } from "@/hooks";

export function Main() {
  const { openModal, closeModal, Modal } = useModal();

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log("submit");
      openModal();
    },
    [openModal],
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
          box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.6);
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
                box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
              `}
            />
            <input
              type="password"
              placeholder="Password"
              css={css`
                padding: 10px 20px;
                border-radius: 30px;
                box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
              `}
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
              box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
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
            max-height: 200px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: white;
            border-radius: 30px;
          `}
        >
          <h3>User not exist</h3>
          <button
            type="button"
            css={css`
              padding: 10px 20px;
              border-radius: 30px;
            `}
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </Modal>
    </main>
  );
}
