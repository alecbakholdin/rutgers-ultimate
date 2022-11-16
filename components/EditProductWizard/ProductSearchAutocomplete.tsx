import React, { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { productCollection } from "../../types/product";

export default function ProductSearchAutocomplete(props: {
  onChange?: (productId: string | null) => void;
}): React.ReactElement {
  const [value, setValue] = useState<{ id: string; label: string } | null>(
    null
  );
  const [products] = useCollectionData(productCollection);
  const productsMapped =
    products?.map((product) => ({ id: product.id, label: product.name })) ?? [];
  return (
    <Autocomplete
      value={value}
      options={productsMapped ?? []}
      onChange={(e, newValue) => {
        setValue(newValue);
        if (props.onChange) {
          props.onChange(newValue?.id ?? null);
        }
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField {...params} label={"Select Product"} />
      )}
      fullWidth
    />
  );
}
