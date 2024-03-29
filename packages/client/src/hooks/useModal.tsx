import { Interpolation, Theme, css } from "@emotion/react";
import { ReactElement, useCallback, useState } from "react";

export function useModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const Modal = useCallback(
    ({
      keepOpen,
      modalCss,
      children,
      onBackgroundClick,
    }: {
      keepOpen?: boolean;
      modalCss?: Interpolation<Theme>;
      children?: ReactElement;
      onBackgroundClick?: () => void;
    }) => {
      if (!isModalOpen) return null;

      return (
        <div
          css={[
            css`
              position: absolute;
              background-color: rgba(0, 0, 0, 0.1);
            `,
            modalCss,
          ]}
          onClick={() => {
            if (!keepOpen) closeModal();
            onBackgroundClick?.();
          }}
        >
          {children}
        </div>
      );
    },
    [closeModal, isModalOpen],
  );

  return { isModalOpen, openModal, closeModal, Modal };
}
