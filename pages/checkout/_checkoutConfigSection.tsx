import { CheckoutConfig } from "../../types/checkout";
import React, { ChangeEvent } from "react";
import { useUserData2 } from "../../types/userData";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";

export function CheckoutConfigSection({
  checkoutConfig,
  setCheckoutConfig,
}: {
  checkoutConfig: CheckoutConfig;
  setCheckoutConfig: (val: CheckoutConfig) => void;
}): React.ReactElement {
  const { user } = useUserData2();
  const isTeam = Boolean(user?.isTeam);
  const updateConfig = (update: Partial<CheckoutConfig>) => {
    setCheckoutConfig({ ...checkoutConfig, ...update });
  };
  const textValUpdater =
    (key: keyof CheckoutConfig) => (e: ChangeEvent<HTMLInputElement>) =>
      updateConfig({ [key]: e.target.value });

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={3}>
        <FormControl>
          <FormLabel>Delivery Method</FormLabel>
          <RadioGroup
            defaultValue={"pickup"}
            value={checkoutConfig.deliveryMethod}
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
              label={"Delivery (+$7)"}
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      {checkoutConfig.deliveryMethod === "delivery" && (
        <Grid item xs={12} md={9}>
          <FormControl>
            <FormLabel>Shipping Address</FormLabel>
            <Grid container spacing={1} sx={{ paddingTop: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label={"Address"}
                  autoComplete={"street-address address-line-1"}
                  value={checkoutConfig.address}
                  onChange={textValUpdater("address")}
                  placeholder={"12345 Main St"}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={7}>
                <TextField
                  label={"City"}
                  autoComplete={"city locality"}
                  value={checkoutConfig.city || ""}
                  onChange={textValUpdater("city")}
                  placeholder={"New York City"}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={4} md={2}>
                <TextField
                  label={"State"}
                  autoComplete={"state province"}
                  value={checkoutConfig.state || ""}
                  onChange={textValUpdater("state")}
                  placeholder={"NJ"}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={8} md={3}>
                <TextField
                  label={"ZipCode"}
                  value={checkoutConfig.zipCode || ""}
                  onChange={textValUpdater("zipCode")}
                  placeholder={"54321"}
                  autoComplete={"postal-code"}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          </FormControl>
        </Grid>
      )}
      {checkoutConfig.deliveryMethod === "pickup" && (
        <Grid item xs={12} md={9}>
          <FormControl>
            <FormLabel>Pickup Location</FormLabel>
            <RadioGroup
              defaultValue={"bid"}
              value={checkoutConfig.pickupLocation || ""}
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
