import { Grid, Paper } from "@mui/material";
import React, { useEffect } from "react";
import AppPagination from "../../app/components/AppPagination";
import CheckBoxComponent from "../../app/components/CheckBoxComponent";
import RadioButtonComponent from "../../app/components/RadioButtonComponent";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import {
  getFiltersAsync,
  productSelector,
  setCatalogAsync,
  setPaginationProductParams,
  setProductParams,
} from "./catalogSlice";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";

interface Props {}

function Catalog(prop: Props) {
  const sortOptions = [
    { value: "name", label: "Alphabetical" },
    { value: "priceDesc", label: "Price-High to Low" },
    { value: "price", label: "Price-Low to High" },
  ];

  const products = useAppSelector(productSelector.selectAll);
  const {
    productLoaded,
    filterLoaded,
    brands,
    types,
    productParams,
    metaData,
  } = useAppSelector(state => state.catalog);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!productLoaded) dispatch(setCatalogAsync());
  }, [productLoaded, dispatch]);

  useEffect(() => {
    if (!filterLoaded) dispatch(getFiltersAsync());
  }, [filterLoaded, dispatch]);

  if (!filterLoaded) return <LoadingComponent />;
  return (
    <Grid container columnSpacing={4}>
      <Grid item xs={3}>
        <Paper sx={{ mb: 2 }}>
          <ProductSearch />
        </Paper>

        <Paper sx={{ mb: 2, p: 2 }}>
          <RadioButtonComponent
            options={sortOptions}
            selectedValue={productParams.orderBy}
            onChange={function (e: any): void {
              dispatch(setProductParams({ orderBy: e.target.value }));
            }}
          />
        </Paper>

        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckBoxComponent
            items={brands}
            checked={productParams.brands}
            onChange={function (items: string[]): void {
              dispatch(setProductParams({ brands: items }));
            }}
          />
        </Paper>

        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckBoxComponent
            checked={productParams.types}
            items={types}
            onChange={function (items: string[]): void {
              dispatch(setProductParams({ types: items }));
            }}
          />
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <ProductList products={products} />
      </Grid>

      <Grid xs={3} />
      <Grid xs={9} sx={{ mb: 2 }}>
        {metaData && (
          <AppPagination
            metaData={metaData}
            onPageChange={function (page: number): void {
              dispatch(setPaginationProductParams({ pageNumber: page }));
            }}
          />
        )}
      </Grid>
    </Grid>
  );
}

export default Catalog;
