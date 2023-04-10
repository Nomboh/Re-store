import { TextField } from "@mui/material";
import React from "react";
import { UseControllerProps, useController } from "react-hook-form";

interface Props extends UseControllerProps {
  label: string;
}

function AppTextInput(props: Props) {
  const { field, fieldState } = useController({ ...props, defaultValue: "" });
  return (
    <TextField
      {...props}
      {...field}
      fullWidth
      variant="outlined"
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
    />
  );
}

export default AppTextInput;
