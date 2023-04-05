import { debounce, TextField } from "@mui/material";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setProductParams } from "./catalogSlice";

type Props = {};

function ProductSearch(prop: Props) {
  const { productParams } = useAppSelector(state => state.catalog);
  const dispatch = useAppDispatch();

  const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);

  const debouncedSearch = debounce((event: any) => {
    dispatch(setProductParams({ searchTerm: event.target.value }));
  }, 1000);
  return (
    <TextField
      label="Search Products"
      variant="outlined"
      value={searchTerm}
      fullWidth
      onChange={e => {
        setSearchTerm(e.target.value);
        debouncedSearch(e);
      }}
    />
  );
}

export default ProductSearch;
