"use client";
import React, { useState } from "react";
import { Product } from "types/product";
import { useAuth } from "components/AuthProvider";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  Popover,
  Select,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import StorageImage from "appComponents/StorageImage";
import LoadingButton from "components/LoadingButton";
import MenuItem from "@mui/material/MenuItem";
import ColorSwatch from "components/ColorSwatch";
import { getFromIndex } from "util/array";
import { useRouter } from "next/navigation";
import FancyCurrency from "appComponents/FancyCurrency";

const productCardSize = 275;

export default function ProductCard({
  product,
  eventId,
}: {
  product: Product;
  eventId: string;
}): React.ReactElement {
  const { palette } = useTheme();
  const { userData, isTeam, loading } = useAuth();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [numberField, setNumberField] = useState("");
  const [nameField, setNameField] = useState("");
  const [sizeField, setSizeField] = useState<string>("");
  const [colorField, setColorField] = useState<string>(
    getFromIndex(product.colors, 0)?.name || ""
  );

  const cardImage =
    product.productImages?.find(
      (i) => !colorField || i.colorNames.includes(colorField)
    ) || getFromIndex(product.productImages, 0);
  const price = isTeam ? product.teamPrice : product.price;

  const handleReset = () => {
    setAnchorEl(null);
    setNumberField("");
    setNameField("");
    setSizeField("");
  };

  const handleNavigation = () =>
    router.push(
      `/store/${eventId}/${product.id}${colorField && `?color=${colorField}`}`
    );

  return (
    <>
      <Box
        sx={{
          borderRadius: 2,
          border: "1px solid " + palette.divider,
          padding: 2,
        }}
      >
        <Grid
          container
          spacing={1}
          alignItems={"center"}
          sx={{
            width: productCardSize,
          }}
        >
          <Grid
            item
            xs={12}
            onClick={handleNavigation}
            sx={{
              width: productCardSize,
              height: productCardSize,
              cursor: "pointer",
            }}
          >
            <StorageImage storagePath={cardImage?.storagePath} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant={"body2"} fontSize={18}>
              {product.name}
            </Typography>
          </Grid>
          {Boolean(product.colors?.length) && (
            <Grid item xs={12} container flexWrap={"nowrap"}>
              {product.colors?.map(({ name, hex }) => (
                <Grid
                  key={name}
                  item
                  onClick={() => setColorField(name)}
                  sx={{ cursor: "pointer" }}
                >
                  <ColorSwatch hex={hex} selected={name === colorField} />
                </Grid>
              ))}
            </Grid>
          )}
          <FancyCurrency
            amount={price}
            size={18}
            loading={!userData || loading}
          />
          <Grid item xs={6} container justifyContent={"end"}>
            <Button
              variant={"contained"}
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ fontSize: 10, paddingLeft: 1, paddingRight: 1 }}
            >
              Add to Cart
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleReset}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box width={200} padding={2}>
          <Stack spacing={1} alignItems={"end"}>
            {product.canHaveNumber && (
              <TextField
                value={numberField}
                onChange={(e) =>
                  setNumberField(e.target.value.replace(/\D/, "").slice(0, 2))
                }
                label={"Number (optional)"}
                size={"small"}
              />
            )}
            {product.canHaveName && (
              <TextField
                value={nameField}
                onChange={(e) => setNameField(e.target.value)}
                label={"Name (optional)"}
                size={"small"}
              />
            )}
            {Boolean(product.sizes?.length) && (
              <FormControl size={"small"} sx={{ width: "100%" }}>
                <InputLabel>Size</InputLabel>
                <Select
                  value={sizeField}
                  onChange={(e) => setSizeField(e.target.value)}
                  label={"Size"}
                  fullWidth
                >
                  {product.sizes.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <LoadingButton>Confirm</LoadingButton>
          </Stack>
        </Box>
      </Popover>
    </>
  );
}
