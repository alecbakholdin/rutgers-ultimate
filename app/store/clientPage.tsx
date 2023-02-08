"use client";
import React, { useEffect } from "react";
import { useMySnackbar } from "hooks/useMySnackbar";

export default function ClientPage({
  text,
}: {
  text: string;
}): React.ReactElement {
  const { showSuccess } = useMySnackbar();
  useEffect(() => {
    showSuccess("Testing");
  }, []);
  return <>{text}</>;
}
