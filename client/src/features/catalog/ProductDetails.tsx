import { LoadingButton } from "@mui/lab";
import { TextField } from "@mui/material";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import {
  addBasketItemsAsync,
  removeBasketItemsAsync,
} from "../basket/basketSlice";
import { getCatalogAsync, productSelector } from "./catalogSlice";

interface Props {}

function ProductDetails(prop: Props) {
  const { id } = useParams<{ id: string }>();

  const { basket, status } = useAppSelector(state => state.basket);
  const { status: productStatus } = useAppSelector(state => state.catalog);

  const product = useAppSelector(state =>
    productSelector.selectById(state, id!)
  );

  const dispatch = useAppDispatch();

  const [quantity, setQuantity] = useState(0);

  const item = basket?.items.find(b => b.productId === product?.id);

  useEffect(() => {
    if (item) setQuantity(item.quantity);
    if (!product) dispatch(getCatalogAsync(parseInt(id!)));
  }, [id, item, product, dispatch]);

  if (productStatus.includes("pending"))
    return <LoadingComponent contain="Loading Product" />;

  if (!product) return <NotFound />;

  function handleQuantityChange(event: any) {
    if (event.target.value >= 0) {
      setQuantity(parseInt(event.target.value));
    }
  }

  function handleSubmit() {
    console.log(product);
    if (!item || quantity > item.quantity) {
      const updateQuantity = item ? quantity - item?.quantity! : quantity;
      dispatch(
        addBasketItemsAsync({
          productId: product?.id!,
          quantity: updateQuantity,
        })
      );
    } else {
      const updateQuantity = item.quantity - quantity;
      dispatch(
        removeBasketItemsAsync({
          productId: item.productId,
          quantity: updateQuantity,
        })
      );
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <img
          src={product.pictureUrl}
          alt={product.name}
          style={{ width: "100%" }}
        />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="h4" color={"secondary"}>
          ${(product.price / 100).toFixed(2)}
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{product.name}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>{product.type}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Brand</TableCell>
                <TableCell>{product.brand}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Quantity in stock</TableCell>
                <TableCell>{product.quantityInStock}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              type={"number"}
              label="Quantity in cart"
              fullWidth
              value={quantity}
              onChange={handleQuantityChange}
            />
          </Grid>
          <Grid item xs={6}>
            <LoadingButton
              disabled={
                quantity === item?.quantity || (!item && quantity === 0)
              }
              loading={
                status.includes("pendingAddItem" + item?.productId) ||
                status.includes("pendingRemoveItem" + item?.productId)
              }
              sx={{ height: "55px" }}
              color="primary"
              size="large"
              variant="contained"
              fullWidth
              onClick={handleSubmit}
            >
              {item ? "Update Quantity" : "Add to Cart"}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ProductDetails;
