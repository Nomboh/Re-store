import { Checkbox, FormControlLabel } from "@mui/material";
import React from "react";
import { UseControllerProps, useController } from "react-hook-form";

interface Props extends UseControllerProps {
  label: string;
  disabled: boolean;
}

function AppCheckBox(props: Props) {
  const { field } = useController({ ...props, defaultValue: false });
  return (
    <FormControlLabel
      control={
        <Checkbox
          disabled={props.disabled}
          {...field}
          color="secondary"
          checked={field.value}
        />
      }
      label={props.label}
    />
  );
}

export default AppCheckBox;
