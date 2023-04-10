import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useAppSelector } from "../../app/store/configureStore";
import BasketSummary from "../basket/BasketSummary";
import TableBasket from "../basket/TableBasket";

export default function Review() {
  const { basket } = useAppSelector(state => state.basket);
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      {basket && <TableBasket items={basket.items} isBasket={false} />}

      <Grid container mt={2}>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
          <BasketSummary />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
