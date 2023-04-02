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
import { Link } from "react-router-dom";
import { BasketItems } from "../../app/models/basket";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemsAsync, removeBasketItemsAsync } from "./basketSlice";
import BasketSummary from "./BasketSummary";

type Props = {};

function BasketItem(prop: Props) {
  const dispatch = useAppDispatch();
  const { basket, status } = useAppSelector(state => state.basket);

  const handleAddItem = (productId: number) => {
    dispatch(addBasketItemsAsync({ productId }));
  };

  const handleRemoveItem = (productId: number, name: string) => {
    dispatch(removeBasketItemsAsync({ productId, quantity: 1, name }));
  };

  const handleDeleteItem = (
    productId: number,
    quantity: number,
    name: string
  ) => {
    dispatch(removeBasketItemsAsync({ productId, quantity, name }));
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
                    onClick={() => handleAddItem(row.productId)}
                    color="secondary"
                    loading={status === "pendingAddItem" + row.productId}
                  >
                    <Add />
                  </LoadingButton>
                  {row.quantity}
                  <LoadingButton
                    onClick={() => handleRemoveItem(row.productId, "remove")}
                    color="error"
                    loading={
                      status === "pendingRemoveItem" + row.productId + "remove"
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
                      handleDeleteItem(row.productId, row.quantity, "del")
                    }
                    loading={
                      status === "pendingRemoveItem" + row.productId + "del"
                    }
                    color="error"
                  >
                    <DeleteOutline />
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
