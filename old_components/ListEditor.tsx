import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  TextFieldProps,
} from "@mui/material";
import BetterTextField from "appComponents/inputs/BetterTextField";
import { Add } from "@mui/icons-material";
import { useMySnackbar } from "hooks/useMySnackbar";
import ListDisplay from "components/ListDisplay";

export default function ListEditor({
  items,
  setItems,
  label,
  loading,
  disabled,
  renderChipAvatar,
  textFieldProps,
  disableMultiAdd,
}: {
  setItems: (items: string[]) => void;
  items?: string[];
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  renderChipAvatar?: (item: string) => React.ReactElement | undefined;
  textFieldProps?: TextFieldProps;
  disableMultiAdd?: boolean;
}): React.ReactElement {
  const [newItem, setNewItem] = useState<string>("");
  const { showError } = useMySnackbar();
  const handleCreateItem = () => {
    if (disabled || !newItem) {
      return;
    }
    const newItems = disableMultiAdd ? [newItem] : newItem.split(",");
    newItems
      .filter((item) => items?.includes(item))
      .forEach((item) => showError(`${item} already exists in this list`));
    const itemsToAdd = newItems
      .map((item) => item.trim())
      .filter((item) => item && !items?.includes(item));
    if (itemsToAdd.length > 0) {
      setItems([...(items ?? []), ...itemsToAdd]);
      setNewItem("");
    }
  };
  const handleDeleteItem = (toDelete: string) => {
    setItems(items?.filter((item) => item != toDelete) ?? []);
  };

  return (
    <Grid container spacing={1}>
      <Grid item>
        <Stack direction={"row"} alignItems={"center"} spacing={1}>
          <BetterTextField
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            handlePressEnter={handleCreateItem}
            label={label}
            disabled={disabled}
            {...textFieldProps}
          />
          {loading ? (
            <Box color={"background"} sx={{ opacity: 0.5 }}>
              <CircularProgress size={35} color={"inherit"} />
            </Box>
          ) : (
            <IconButton
              onClick={handleCreateItem}
              sx={{ width: 40, height: 40, border: "1px solid", opacity: 0.75 }}
              disabled={disabled}
            >
              <Add />
            </IconButton>
          )}
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <ListDisplay
          items={items}
          handleDeleteItem={handleDeleteItem}
          renderChipAvatar={renderChipAvatar}
        />
      </Grid>
    </Grid>
  );
}
