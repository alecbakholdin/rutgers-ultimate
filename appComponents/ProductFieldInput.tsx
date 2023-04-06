import { FormGroup, FormLabel, TextField } from "@mui/material";
import StringChipList from "appComponents/StringChipList";
import React from "react";
import { ProductField } from "types/product";

export default function ({
  field,
  fieldValue,
  setFieldValue,
}: {
  field: ProductField;
  fieldValue?: any;
  setFieldValue: (newValue: any) => void;
}) {
  return field.type === "text" ? (
    <TextField
      label={field.name + (!field.required && " (optional)")}
      value={fieldValue || ""}
      onChange={(e) => setFieldValue(e.target.value)}
      required={field.required}
    />
  ) : field.type === "options" ? (
    <FormGroup>
      <FormLabel>
        {field.name}
        {field.required ? "*" : " (optional)"}
      </FormLabel>
      <StringChipList
        options={field.options}
        selected={fieldValue && [fieldValue]}
        setSelected={(v) => setFieldValue(v.length ? v[0] : undefined)}
      />
    </FormGroup>
  ) : field.type === "number" ? (
    <TextField
      label={field.name + (!field.required && " (optional)")}
      value={fieldValue || ""}
      onChange={(e) =>
        setFieldValue(
          e.target.value.replace(/\D/, "").slice(0, field.maxChars || undefined)
        )
      }
      required={field.required}
    />
  ) : (
    <></>
  );
}
