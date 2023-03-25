import { Container, Divider, Paper, Typography } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";

type Props = {};

function ServerError(prop: Props) {
  const { state } = useLocation();
  return (
    <Container component={Paper}>
      <Typography gutterBottom variant="h5">
        {state.error ? (
          <>
            <Typography gutterBottom variant="h3" color={"secondary"}>
              {state.error.title}
            </Typography>
            <Divider />
            <Typography variant="body1">
              {state.error.detail || "Internal server error"}
            </Typography>
          </>
        ) : (
          <Typography variant="body1">{"Internal server error"}</Typography>
        )}
      </Typography>
    </Container>
  );
}

export default ServerError;
