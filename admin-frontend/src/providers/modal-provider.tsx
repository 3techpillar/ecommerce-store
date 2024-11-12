"use client";

import { useEffect, useState } from "react";
import { BusinessModal } from "@/modals/business-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <BusinessModal />
    </>
  );
};
