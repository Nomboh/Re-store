import { Button, Container, Divider, Paper, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

type Props = {};

function NotFound(prop: Props) {
  return (
    <Container component={Paper} sx={{ height: 200 }}>
      <Typography gutterBottom variant="h3">
        Opps - we could not fine what you are looking for
      </Typography>
      <Divider />
      <Button fullWidth component={Link} to="/catalog">
        Go back to shop
      </Button>
    </Container>
  );
}

export default NotFound;
