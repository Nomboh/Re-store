import React, { useEffect, useState } from "react";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";

type Props = {};

function Catalog({}: Props) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(response => response.json())
      .then(data => setProducts(data));
  }, []);
  return (
    <>
      <ProductList products={products} />
    </>
  );
}

export default Catalog;
