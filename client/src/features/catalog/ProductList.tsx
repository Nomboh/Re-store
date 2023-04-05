import { Grid } from "@mui/material";
import React from "react";
import ProductCardSkeleton from "../../app/components/ProductCardSkeleton";
import { Product } from "../../app/models/product";
import { useAppSelector } from "../../app/store/configureStore";
import ProductCard from "./ProductCard";

interface Props {
  products: Product[];
}

function ProductList({ products }: Props) {
  const { productLoaded } = useAppSelector(state => state.catalog);
  return (
    <Grid container spacing={4}>
      {products.map(product => (
        <Grid item xs={4} key={product.id}>
          {!productLoaded ? (
            <ProductCardSkeleton />
          ) : (
            <ProductCard product={product} />
          )}
        </Grid>
      ))}
    </Grid>
  );
}

export default ProductList;
