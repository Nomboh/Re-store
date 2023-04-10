import { Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/store/configureStore";
import BasketSummary from "./BasketSummary";
import TableBasket from "./TableBasket";

type Props = {};

function BasketItem(prop: Props) {
  const { basket } = useAppSelector(state => state.basket);

  if (!basket) return <Typography variant="h1">You Basket is Empty</Typography>;

  return (
    <>
      <TableBasket items={basket.items} />
      <Grid container mt={2}>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
          <BasketSummary />
          <Button
            size="large"
            color="primary"
            variant="contained"
            component={Link}
            to="/checkout"
            fullWidth
          >
            Checkout
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default BasketItem;
