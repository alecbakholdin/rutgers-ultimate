import { CheckoutConfig } from "types/checkout";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useUserData2 } from "types/userData";
import {
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { LovelySwitch } from "components/LovelySwitch";
import { currencyFormat } from "util/currency";
import {
  getLowestRateShippingCost,
  validateCheckoutConfigForAddress,
} from "appUtil/easyPost";

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

  useEffect(() => {
    if (user?.email && !checkoutConfig.email) {
      updateConfig({ email: user.email });
    }
  }, [user]);

  const [shippingCostLoading, setShippingCostLoading] = useState(false);
  const [shippingCostTimeout, setShippingCostTimeout] = useState<
    NodeJS.Timeout | undefined
  >(undefined);
  const [shippingCost, setShippingCost] = useState(0);
  useEffect(() => {
    console.log(checkoutConfig);
    if (validateCheckoutConfigForAddress(checkoutConfig)) {
      clearTimeout(shippingCostTimeout);
      const timeout = setTimeout(async () => {
        const address = validateCheckoutConfigForAddress(checkoutConfig);
        if (address) {
          setShippingCost(await getLowestRateShippingCost(address));
        }
        setShippingCostTimeout(undefined);
      }, 500);
      setShippingCostTimeout(timeout);
    } else {
      clearTimeout(shippingCostTimeout);
      setShippingCostTimeout(undefined);
    }
  }, [checkoutConfig.zipCode]);

  return (
    <Grid container rowSpacing={3} spacing={1}>
      <Grid item xs={12}>
        <FormControl sx={{ width: "100%" }}>
          <FormLabel>Personal Details</FormLabel>
          <Grid container spacing={1} sx={{ paddingTop: 1 }}>
            <Grid item xs={5}>
              <TextField
                label={"First Name"}
                placeholder={"John"}
                value={checkoutConfig.firstName || ""}
                onChange={textValUpdater("firstName")}
                autoComplete={"given-name"}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={7}>
              <TextField
                label={"Last Name"}
                placeholder={"Smith"}
                value={checkoutConfig.lastName || ""}
                onChange={textValUpdater("lastName")}
                autoComplete={"family-name"}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={"Phone Number"}
                placeholder={"+1 123 555 8888"}
                value={checkoutConfig.phoneNumber || ""}
                onChange={textValUpdater("phoneNumber")}
                autoComplete={"tel"}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={"Email"}
                placeholder={"john.smith@example.com"}
                value={checkoutConfig.email}
                disabled
                fullWidth
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
              label={"Delivery ($)"}
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
              {Boolean(checkoutConfig.zipCode) && (
                <Grid item xs={12}>
                  <Typography color={"lightslategray"} variant={"body2"}>
                    Estimated delivery cost:
                    {shippingCostTimeout ? (
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

      <Grid item xs={12}>
        <FormGroup>
          <FormControlLabel
            control={
              <LovelySwitch
                checked={checkoutConfig.sendEmailReceipt}
                onChange={() =>
                  updateConfig({
                    sendEmailReceipt: !checkoutConfig.sendEmailReceipt,
                  })
                }
              />
            }
            label={"Email me a receipt"}
          />
        </FormGroup>
      </Grid>
    </Grid>
  );
}
