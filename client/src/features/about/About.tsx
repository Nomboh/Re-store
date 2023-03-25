import {
  Alert,
  AlertTitle,
  Button,
  ButtonGroup,
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import agent from "../../app/api/agent";

type Props = {};

function About(prop: Props) {
  const [validation, setValidation] = useState<string[]>([]);
  const handleValidationError = () => {
    agent.buggy
      .getValidation()
      .then(() => {
        console.log("This would never be called");
      })
      .catch(error => {
        console.log(error);
        setValidation(error);
      });
  };
  return (
    <Container>
      <Typography gutterBottom variant="h2">
        Errors for testing Purposes
      </Typography>
      <ButtonGroup fullWidth>
        <Button
          variant="contained"
          onClick={() =>
            agent.buggy
              .getBadRequest()
              .then(() => console.log("This would never be printed"))
              .catch(error => console.log(error))
          }
        >
          Bad Request
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            agent.buggy
              .getNotFound()
              .then(() => console.log("This would never be printed"))
              .catch(error => console.log(error))
          }
        >
          Not Found
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            agent.buggy
              .getUnauthorised()
              .then(() => console.log("This would never be printed"))
              .catch(error => console.log(error))
          }
        >
          Unauthorised
        </Button>
        <Button variant="contained" onClick={handleValidationError}>
          Validation Error
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            agent.buggy
              .getServer()
              .then(() => console.log("This would never be printed"))
              .catch(error => console.log(error))
          }
        >
          Server Error
        </Button>
      </ButtonGroup>

      {validation.length > 0 && (
        <Alert severity="error" sx={{ mt: 4 }}>
          <AlertTitle>Validation Errors</AlertTitle>
          <List>
            {validation.map(error => (
              <ListItem key={error}>
                <ListItemText>{error}</ListItemText>
              </ListItem>
            ))}
          </List>
        </Alert>
      )}
    </Container>
  );
}

export default About;
