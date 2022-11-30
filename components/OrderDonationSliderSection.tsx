"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Slider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { OrderInfo } from "types/order";
import { Add, HelpOutline, Remove } from "@mui/icons-material";

export default function OrderDonationSliderSection({
  orderInfo,
  setOrderInfo,
}: {
  orderInfo: OrderInfo;
  setOrderInfo: (orderInfo: OrderInfo) => void;
}): React.ReactElement {
  const machinePercentage = orderInfo.machinePercentage ?? 50;
  const nightshadePercentage = orderInfo.nightshadePercentage ?? 50;

  const changeDistribution = (newValue: number) => {
    const val = Math.max(0, Math.min(100, newValue));
    setOrderInfo({
      ...orderInfo,
      machinePercentage: val,
      nightshadePercentage: 100 - val,
    });
  };
  const handleDistributionChange = (e: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      changeDistribution(newValue);
    }
  };

  return (
    <Card>
      <CardHeader
        title={
          <Stack direction={"row"}>
            Donation Distribution
            <Tooltip
              title={
                "Please select the portion of your donation you'd like to give each team."
              }
              sx={{ cursor: "pointer", marginLeft: 1, marginTop: 0.5 }}
            >
              <Typography color={"grey"}>
                <HelpOutline />
              </Typography>
            </Tooltip>
          </Stack>
        }
      />
      <CardContent sx={{ display: "flex", justifyContent: "center" }}>
        <Grid container maxWidth={"sm"}>
          <Grid item container flexDirection={"column"} xs={6}>
            <Typography variant={"h5"} color={"grey"}>
              Machine
            </Typography>
            <Typography variant={"h6"} color={"grey"}>
              {machinePercentage}%
            </Typography>
          </Grid>
          <Grid item container flexDirection={"column"} xs={6}>
            <Typography variant={"h5"} textAlign={"right"} color={"grey"}>
              Nightshade
            </Typography>
            <Typography variant={"h6"} color={"grey"} textAlign={"right"}>
              {nightshadePercentage}%
            </Typography>
          </Grid>
          <Grid item container flexWrap={"nowrap"} alignItems={"center"}>
            <IconButton
              onClick={() => changeDistribution(machinePercentage - 10)}
            >
              <Remove fontSize={"large"} />
            </IconButton>
            <Slider
              value={machinePercentage}
              onChange={handleDistributionChange}
              step={10}
              min={0}
              max={100}
              valueLabelDisplay={"off"}
              sx={{ flexGrow: 1, marginLeft: 2, marginRight: 2 }}
            />
            <IconButton
              onClick={() => changeDistribution(machinePercentage + 10)}
            >
              <Add fontSize={"large"} />
            </IconButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
