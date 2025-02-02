import { useLayoutEffect } from "react";

const canUseDOM = (): boolean => {
  return (
    typeof window !== "undefined" &&
    typeof window.document !== "undefined" &&
    typeof window.document.createElement !== "undefined"
  );
};

export const useClientLayoutEffect = canUseDOM() ? useLayoutEffect : () => {};
