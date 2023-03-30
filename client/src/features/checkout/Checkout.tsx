import { Typography } from "@mui/material";
import React from "react";

type Props = {};

function Checkout(prop: Props) {
  return (
    <Typography variant="h3">Only loged in Users can see this page</Typography>
  );
}

export default Checkout;
