import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useFormContext } from "react-hook-form";
import AppTextInput from "../../app/components/AppTextInput";
import AppCheckBox from "../../app/components/AppCheckBox";

export default function AddressForm() {
  const { control, formState } = useFormContext();
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <AppTextInput
            control={control}
            label={"Full name"}
            name={"fullName"}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput
            control={control}
            label={"Address line 1"}
            name={"address1"}
          />
        </Grid>
        <Grid item xs={12}>
          <AppTextInput
            control={control}
            label={"Address line 2"}
            name={"address2"}
          />
        </Grid>
        <Grid item xs={12}>
          <AppTextInput control={control} label={"City"} name={"city"} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput
            control={control}
            label={"State/Province/Region"}
            name={"state"}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} label={"Zip"} name={"zip"} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} label={"Country"} name={"country"} />
        </Grid>
        <Grid item xs={12}>
          <AppCheckBox
            label="Save this as the default address"
            name="saveAddress"
            disabled={!formState.isDirty}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
