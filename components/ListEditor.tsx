import React, { useState } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  TextFieldProps,
} from "@mui/material";
import BetterTextField from "components/BetterTextField";
import { useSnackbar } from "notistack";
import { Add } from "@mui/icons-material";

export default function ListEditor({
  items,
  setItems,
  label,
  loading,
  disabled,
  renderChipAvatar,
  textFieldProps,
}: {
  setItems: (items: string[]) => void;
  items?: string[];
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  renderChipAvatar?: (item: string) => React.ReactElement | undefined;
  textFieldProps?: TextFieldProps;
}): React.ReactElement {
  const [newItem, setNewItem] = useState<string>("");
  const { enqueueSnackbar } = useSnackbar();
  const handleCreateItem = () => {
    if (disabled || !newItem) {
      return;
    }
    if (items?.includes(newItem)) {
      enqueueSnackbar("That item already exists in this list", {
        variant: "error",
        autoHideDuration: 1000,
      });
      return;
    }
    setItems([...(items ?? []), newItem]);
    setNewItem("");
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
            >
              <Add />
            </IconButton>
          )}
        </Stack>
      </Grid>
      <Grid item container xs={12} spacing={1}>
        {items?.map((item) => (
          <Grid item key={item}>
            <Chip
              label={item}
              avatar={renderChipAvatar && renderChipAvatar(item)}
              onDelete={() => handleDeleteItem(item)}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
