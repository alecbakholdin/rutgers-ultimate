"use client";
import React from "react";
import ProductWizard from "app/(RegularApp)/admin/products/ProductWizard";
import { Stack } from "@mui/material";
import ColorWizard from "app/(RegularApp)/admin/products/ColorWizard";

export default function ManageProducts() {
  return (
    <Stack spacing={2}>
      <ProductWizard />
      <ColorWizard />
    </Stack>
  );
}
