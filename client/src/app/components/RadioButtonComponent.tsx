import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import React from "react";

type Props = {
  options: any[];
  selectedValue: string;
  onChange: (e: any) => void;
};

function RadioButtonComponent({ onChange, options, selectedValue }: Props) {
  return (
    <FormControl>
      <RadioGroup onChange={onChange} value={selectedValue}>
        {options.map(({ value, label }) => (
          <FormControlLabel
            key={value}
            value={value}
            control={<Radio />}
            label={label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

export default RadioButtonComponent;
