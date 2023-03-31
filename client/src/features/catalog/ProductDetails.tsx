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
import agent from "../../app/api/agent";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Product } from "../../app/models/product";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { removeItem, setBasket } from "../basket/basketSlice";

interface Props {}

function ProductDetails(prop: Props) {
  const { id } = useParams<{ id: string }>();

  const {basket} = useAppSelector(state => state.basket)

  const dispatch = useAppDispatch();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quantity, setQuantity] = useState(0);

  const item = basket?.items.find(b => b.productId === product?.id);

  useEffect(() => {
    if (item) setQuantity(item.quantity);
    id &&
      agent.catalog
        .details(parseInt(id))
        .then(response => {
          setLoading(true);
          setProduct(response);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => setLoading(false));
  }, [id, item]);

  if (loading) return <LoadingComponent contain="Loading Product" />;

  if (!product) return <NotFound />;

  function handleQuantityChange(event: any) {
    if (event.target.value >= 0) {
      setQuantity(parseInt(event.target.value));
    }
  }

  function handleSubmit() {
    setSubmitting(true);

    if (!item || quantity > item.quantity) {
      const updateQuantity = item ? quantity - item?.quantity! : quantity;
      agent.basket
        .addBasket(product?.id!, updateQuantity)
        .then(basket => dispatch(setBasket(basket)))
        .catch(error => console.log(error))
        .finally(() => setSubmitting(false));
    } else {
      const updateQuantity = item.quantity - quantity;
      agent.basket
        .removeBasket(product?.id!, updateQuantity)
        .then(() => dispatch(removeItem({productId: product?.id, quantity: updateQuantity})))
        .catch(error => console.log(error))
        .finally(() => setSubmitting(false));
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
              loading={submitting}
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
