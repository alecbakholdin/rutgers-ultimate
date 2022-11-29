"use client";

import React, { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Color, colorCollection } from "types/color";
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Grid,
  IconButton,
} from "@mui/material";
import BetterTextField from "components/BetterTextField";
import { deleteDoc, doc, setDoc } from "@firebase/firestore";
import ColorSwatch from "components/ColorSwatch";
import { Add } from "@mui/icons-material";
import { useMySnackbar } from "hooks/useMySnackbar";

export default function EditColorsWizard(): React.ReactElement {
  const [colors] = useCollectionData(colorCollection, {
    initialValue: [],
  });
  const [name, setName] = useState("");
  const [hex, setHex] = useState("");
  const handleChangeHex = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value
      .toUpperCase()
      .replace(/[^\dA-F]/, "")
      .slice(0, 6);
    setHex(newHex);
  };

  const { showError } = useMySnackbar();
  const handleAdd = async () => {
    if (!name || !hex || hex.length != 6) {
      showError("Please fill out name and hex for the color before adding it");
      return;
    }
    const docRef = doc(colorCollection, name);
    await setDoc(docRef, { id: name, hex: "#" + hex } as Color);
  };
  const handleDelete = async (id: string) => {
    const docRef = doc(colorCollection, id);
    await deleteDoc(docRef);
  };

  return (
    <Container maxWidth={"lg"}>
      <Card>
        <CardHeader title={"Manage Colors"} />
        <CardContent>
          <Grid container spacing={1} alignItems={"center"}>
            <Grid item>
              <BetterTextField
                value={name}
                onChange={(e) => setName(e.target.value)}
                label={"Name"}
                handlePressEnter={handleAdd}
              />
            </Grid>
            <Grid item>
              <BetterTextField
                value={hex}
                onChange={handleChangeHex}
                label={"Hex"}
                handlePressEnter={handleAdd}
                InputProps={{
                  startAdornment: "#",
                  endAdornment: <ColorSwatch hex={"#" + hex} />,
                }}
              />
            </Grid>
            <Grid item>
              <IconButton onClick={handleAdd}>
                <Add />
              </IconButton>
            </Grid>
            <Grid item xs={12} />
            {colors?.map((color) => (
              <Grid item key={color.id}>
                <Chip
                  label={color.id}
                  avatar={<ColorSwatch size={20} hex={color.hex} />}
                  onDelete={() => handleDelete(color.id)}
                  sx={{ paddingLeft: 0.5 }}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
