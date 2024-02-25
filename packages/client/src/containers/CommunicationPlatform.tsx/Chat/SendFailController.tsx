import React from "react";

import { Button } from "@/components";

interface SendFailControllerProps {
  onResendButtonClick?: () => void;
  onDeleteButtonClick: () => void;
}

export function SendFailController({
  onDeleteButtonClick,
  onResendButtonClick,
}: SendFailControllerProps) {
  return (
    <>
      <Button type="button" onClick={onResendButtonClick}>
        📨
      </Button>
      <Button type="button" onClick={onDeleteButtonClick}>
        ❌
      </Button>
    </>
  );
}
