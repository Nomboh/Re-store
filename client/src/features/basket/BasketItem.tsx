import { Add, DeleteOutline, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import agent from "../../app/api/agent";
import { BasketItems } from "../../app/models/basket";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { removeItem, setBasket } from "./basketSlice";
import BasketSummary from "./BasketSummary";

type Props = {};

function BasketItem(prop: Props) {
  const dispatch = useAppDispatch()
  const {basket}=useAppSelector(state => state.basket);
  const [status, setStatus] = useState({
    loading: false,
    name: "",
  });

  const handleAddItem = (productId: number, name: string) => {
    setStatus({
      loading: true,
      name,
    });

    agent.basket
      .addBasket(productId)
      .then(basket => dispatch(setBasket(basket)))
      .catch(error => console.log(error))
      .finally(() =>
        setStatus({
          loading: false,
          name: "",
        })
      );
  };

  const handleRemoveItem = (
    productId: number,
    quantity: number = 1,
    name: string
  ) => {
    setStatus({
      loading: true,
      name,
    });

    agent.basket
      .removeBasket(productId, quantity)
      .then(() => dispatch(removeItem({productId, quantity})))
      .catch(error => console.log(error))
      .finally(() =>
        setStatus({
          loading: false,
          name: "",
        })
      );
  };

  if (!basket) return <Typography variant="h1">You Basket is Empty</Typography>;
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Products</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {basket.items.map((row: BasketItems) => (
              <TableRow
                key={row.productId}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Box display={"flex"} alignItems="center">
                    <img
                      src={row.pictureUrl}
                      alt={row.name}
                      style={{ height: 50, marginRight: 20 }}
                    />
                    <span>{row.name}</span>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  ${(row.price / 100).toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <LoadingButton
                    onClick={() =>
                      handleAddItem(row.productId, row.productId + "add")
                    }
                    color="secondary"
                    loading={
                      status.loading && status.name === row.productId + "add"
                    }
                  >
                    <Add />
                  </LoadingButton>
                  {row.quantity}
                  <LoadingButton
                    onClick={() =>
                      handleRemoveItem(row.productId, 1, row.productId + "del")
                    }
                    color="error"
                    loading={
                      status.loading && status.name === row.productId + "del"
                    }
                  >
                    <Remove />
                  </LoadingButton>
                </TableCell>
                <TableCell align="right">
                  ${((row.price * row.quantity) / 100).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  <LoadingButton
                    onClick={() =>
                      handleRemoveItem(
                        row.productId,
                        row.quantity,
                        row.productId + "rem"
                      )
                    }
                    loading={
                      status.loading && status.name === row.productId + "rem"
                    }
                  >
                    <DeleteOutline color="error" />
                  </LoadingButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
