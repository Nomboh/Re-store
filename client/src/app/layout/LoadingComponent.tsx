import { Backdrop, CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

type Props = {
  contain?: string;
};

function LoadingComponent({ contain }: Props) {
  return (
    <Backdrop open={true} invisible={true}>
      <Box
        display={"flex"}
        justifyContent="center"
        alignItems={"center"}
        height="100vh"
      >
        <CircularProgress size={150} color={"secondary"} />
        <Typography
          variant="h5"
          mt={2}
          sx={{ justifyContent: "center", position: "fixed", top: "60%" }}
        >
          {!contain ? "Loading app" : contain} ...
        </Typography>
      </Box>
    </Backdrop>
  );
}

export default LoadingComponent;
