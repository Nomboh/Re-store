import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import React, { useState } from "react";

type Props = {
  items: string[];
  checked?: string[];
  onChange: (items: string[]) => void;
};

function CheckBoxComponent({ items, checked, onChange }: Props) {
  const [checkedItems, setCheckedItems] = useState(checked || []);

  function handleChecked(value: string) {
    const currentIndex = checkedItems.findIndex(item => item === value);

    let newItems: string[] = [];

    if (currentIndex === -1) newItems = [...checkedItems, value];
    else newItems = checkedItems.filter(item => item !== value);

    setCheckedItems(newItems);
    onChange(newItems);
  }
  return (
    <FormGroup>
      {items.map(item => (
        <FormControlLabel
          key={item}
          control={
            <Checkbox
              checked={checkedItems.indexOf(item) !== -1}
              onClick={() => handleChecked(item)}
            />
          }
          label={item}
        />
      ))}
    </FormGroup>
  );
}

export default CheckBoxComponent;
