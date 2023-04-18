"use client";

import { OrderDetails } from "types/order";
import React, { ChangeEvent, useEffect } from "react";
import { useCheckout } from "app/(RegularApp)/checkout/CheckoutProvider";
import {
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { currencyFormat } from "util/currency";
import { Address } from "types/easyPost";
import { useShippingCostEstimate } from "hooks/useShippingCostEstimate";
import { useAuth } from "appComponents/AuthProvider";

export default function CheckoutDetails({
  defaultDetails,
}: {
  defaultDetails: Partial<OrderDetails>;
}) {
  const { isTeam } = useAuth();
  const { details, setDetails } = useCheckout();
  useEffect(() => {
    setDetails({ ...details, ...defaultDetails });
  }, []);
  const [shippingCost, shippingCostLoading] = useShippingCostEstimate(details);

  const textValUpdater =
    (field: keyof OrderDetails) => (e: ChangeEvent<HTMLInputElement>) =>
      setDetails({ ...details, [field]: e.target.value });
  const addressFieldUpdater =
    (field: keyof Address) => (e: ChangeEvent<HTMLInputElement>) =>
      setDetails({
        ...details,
        deliveryLocation: {
          ...details.deliveryLocation,
          [field]: e.target.value,
        },
      });

  return (
    <Grid container rowSpacing={3} spacing={1}>
      <Grid item xs={12}>
        <FormControl sx={{ width: "100%" }}>
          <FormLabel>Personal Details</FormLabel>
          <Grid container spacing={1} sx={{ paddingTop: 1 }}>
            <Grid item xs={12} md={7}>
              <TextField
                label={"Name"}
                placeholder={"John Smith"}
                value={details.name || ""}
                onChange={textValUpdater("name")}
                autoComplete={"name"}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                label={"Phone Number"}
                placeholder={"+1 123 555 8888"}
                value={details.phone || ""}
                onChange={textValUpdater("phone")}
                autoComplete={"tel"}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={"Email"}
                placeholder={"john.smith@example.com"}
                value={details.email}
                onChange={textValUpdater("email")}
                autoComplete={"email"}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={3}>
        <FormControl>
          <FormLabel>Delivery Method</FormLabel>
          <RadioGroup
            defaultValue={"pickup"}
            value={details.deliveryMethod}
            onChange={textValUpdater("deliveryMethod")}
          >
            <FormControlLabel
              value={"pickup"}
              control={<Radio />}
              label={"Pickup"}
            />
            <FormControlLabel
              value={"delivery"}
              control={<Radio />}
              label={"Delivery ($)"}
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      {details.deliveryMethod === "delivery" && (
        <Grid item xs={12} md={9}>
          <FormControl>
            <FormLabel>Shipping Address</FormLabel>
            <Grid container spacing={1} sx={{ paddingTop: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label={"Address"}
                  autoComplete={"street-address address-line-1"}
                  value={details.deliveryLocation.street1}
                  onChange={addressFieldUpdater("street1")}
                  placeholder={"12345 Main St"}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={7}>
                <TextField
                  label={"City"}
                  autoComplete={"city locality"}
                  value={details.deliveryLocation.city || ""}
                  onChange={addressFieldUpdater("city")}
                  placeholder={"New York City"}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={4} md={2}>
                <TextField
                  label={"State"}
                  autoComplete={"state province"}
                  value={details.deliveryLocation.state || ""}
                  onChange={addressFieldUpdater("state")}
                  placeholder={"NJ"}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={8} md={3}>
                <TextField
                  label={"ZipCode"}
                  value={details.deliveryLocation.zipCode || ""}
                  onChange={addressFieldUpdater("zipCode")}
                  placeholder={"54321"}
                  autoComplete={"postal-code"}
                  fullWidth
                  required
                />
              </Grid>
              {Boolean(
                details.deliveryMethod === "delivery" &&
                  details.deliveryLocation.zipCode
              ) && (
                <Grid item xs={12}>
                  <Typography color={"lightslategray"} variant={"body2"}>
                    Estimated delivery cost:{" "}
                    {shippingCostLoading ? (
                      <CircularProgress color={"info"} size={10} />
                    ) : (
                      currencyFormat(shippingCost)
                    )}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </FormControl>
        </Grid>
      )}
      {details.deliveryMethod === "pickup" && (
        <Grid item xs={12} md={9}>
          <FormControl>
            <FormLabel>Pickup Location</FormLabel>
            <RadioGroup
              defaultValue={"bid"}
              value={details.pickupLocation || ""}
              onChange={textValUpdater("pickupLocation")}
            >
              <FormControlLabel
                value={"bid"}
                control={<Radio />}
                label={"68 Central Avenue, New Brunswick, NJ 08901"}
              />
              {isTeam && (
                <FormControlLabel
                  value={"practice"}
                  control={<Radio />}
                  label={"Practice"}
                />
              )}
            </RadioGroup>
          </FormControl>
        </Grid>
      )}
    </Grid>
  );
}
