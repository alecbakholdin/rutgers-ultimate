"use client";
import React from "react";
import ProductWizard from "app/admin/products/ProductWizard";
import { Stack } from "@mui/material";
import ColorWizard from "app/admin/products/ColorWizard";

export default function () {
  return (
    <Stack spacing={2}>
      <ProductWizard />
      <ColorWizard />
    </Stack>
  );
}
