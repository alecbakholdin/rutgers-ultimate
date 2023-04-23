import { ProductField } from "types/product";
import {
  Autocomplete,
  Chip,
  createFilterOptions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Color, colorCollection } from "types/color";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ColorSwatch from "appComponents/ColorSwatch";
import BetterTextField from "appComponents/inputs/BetterTextField";
import { SketchPicker } from "react-color";
import LoadingButton from "appComponents/inputs/LoadingButton";
import { useMySnackbar } from "hooks/useMySnackbar";
import { deleteDoc, doc, getDoc, setDoc } from "@firebase/firestore";
import { Clear } from "@mui/icons-material";

type OptionType = Color & { newColorOption?: boolean };
const filterColors = createFilterOptions<OptionType>();

export default function ColorProductFieldEditor({
  field,
  updateField,
}: {
  field: ProductField;
  updateField: (update: Partial<ProductField>) => void;
}) {
  const [colorArr, loading] = useCollectionData(colorCollection);
  const { showError, showSuccess } = useMySnackbar();
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("");
  const [createColorOpen, setCreateColorOpen] = useState(false);
  const [createColorLoading, setCreateColorLoading] = useState(false);

  const [colorToDelete, setColorToDelete] = useState("");
  const [deleteColorLoading, setDeleteColorLoading] = useState(false);

  const handleOpenCreateColorDialog = (name: string) => {
    setNewColorName(name);
    setCreateColorOpen(true);
  };
  const handleCloseCreateColorDialog = () => {
    setCreateColorOpen(false);
    setNewColorName("");
    setNewColorHex("");
  };

  const handleCreateColor = async () => {
    if (!newColorName || !newColorHex) {
      showError("Name and hex must be set before creation");
      return;
    }
    setCreateColorLoading(true);
    try {
      if ((await getDoc(doc(colorCollection, newColorName))).exists()) {
        showError("Color with that name already exists");
        return;
      }
      await setDoc(doc(colorCollection, newColorName), {
        hex: newColorHex,
      });
      updateField({
        colors: [...field.colors, { name: newColorName, hex: newColorHex }],
      });
      handleCloseCreateColorDialog();
      showSuccess("Color created successfully");
    } catch (e) {
      console.error(e);
      showError("Unexpected error occurred");
    } finally {
      setCreateColorLoading(false);
    }
  };

  const handleDeleteColor = async () => {
    if (!colorToDelete) return;

    setDeleteColorLoading(true);
    await deleteDoc(doc(colorCollection, colorToDelete))
      .catch((e) => {
        console.error(e);
        showError("Unexpected error deleting color");
      })
      .finally(() => setDeleteColorLoading(false));
    setColorToDelete("");
    showSuccess("Color deleted successfully");
  };

  return (
    <>
      <Autocomplete
        loading={loading}
        multiple
        options={colorArr || []}
        getOptionLabel={(p: OptionType) => p.id}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        value={field.colors.map((c) => ({ id: c.name, hex: c.hex } as Color))}
        onChange={(e, colors) => {
          const addOption = colors.find(
            ({ newColorOption }: OptionType) => newColorOption
          );
          if (addOption) {
            handleOpenCreateColorDialog(addOption.hex);
          } else {
            updateField({
              colors: colors.map((c: Color) => ({ name: c.id, hex: c.hex })),
            });
          }
        }}
        filterOptions={(options: Color[], params) => {
          const filtered = filterColors(options, params);

          if (params.inputValue !== "") {
            filtered.push({
              id: `Add "${params.inputValue}"`,
              hex: params.inputValue,
              newColorOption: true,
            } as OptionType);
          }

          return filtered;
        }}
        renderInput={(params) => (
          <TextField {...params} label={"Add a Color"} />
        )}
        renderOption={(props, option) => (
          <li {...props}>
            <Stack
              direction={"row"}
              alignItems={"center"}
              spacing={2}
              width={"100%"}
            >
              {!option.newColorOption && <ColorSwatch hex={option.hex} />}
              <Typography textOverflow={"ellipsis"} flexGrow={1}>
                {option.id}
              </Typography>
              {!option.newColorOption && (
                <IconButton
                  size={"small"}
                  onClick={() => setColorToDelete(option.id)}
                >
                  <Clear fontSize={"small"} />
                </IconButton>
              )}
            </Stack>
          </li>
        )}
        renderTags={(value: readonly Color[], getTagProps) =>
          value.map((option: Color, index: number) => (
            <Chip
              label={option.id}
              avatar={
                <ColorSwatch
                  hex={option.hex}
                  size={20}
                  sx={{ marginLeft: 0.75 }}
                />
              }
              {...getTagProps({ index })}
              key={index}
            />
          ))
        }
      />
      <Dialog
        open={createColorOpen}
        onClose={handleCloseCreateColorDialog}
        sx={{ padding: 3 }}
      >
        <DialogTitle>New Color</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ paddingTop: 1 }}>
            <BetterTextField
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              label={"Name"}
            />
            <SketchPicker
              color={newColorHex}
              onChange={(e) => setNewColorHex(e.hex)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            onClick={handleCreateColor}
            loading={createColorLoading}
          >
            Create
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <Dialog
        open={Boolean(colorToDelete)}
        onClose={() => setColorToDelete("")}
      >
        <DialogContent>
          <Typography variant={"body1"}>
            Are you sure you want to delete the color {colorToDelete}? This will
            delete it for everyone but will NOT remove it from products.
          </Typography>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={deleteColorLoading}
            onClick={handleDeleteColor}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
