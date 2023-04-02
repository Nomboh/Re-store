import React, { useEffect } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { productSelector, setCatalogAsync } from "./catalogSlice";
import ProductList from "./ProductList";

interface Props {}

function Catalog(prop: Props) {
  const products = useAppSelector(productSelector.selectAll);
  const { status, productLoaded } = useAppSelector(state => state.catalog);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!productLoaded) dispatch(setCatalogAsync());
  }, [productLoaded, dispatch]);

  if (status === "pendingFetchProducts") return <LoadingComponent />;
  return (
    <>
      <ProductList products={products} />
    </>
  );
}

export default Catalog;
