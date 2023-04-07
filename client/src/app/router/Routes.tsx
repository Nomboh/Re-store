import { createBrowserRouter, Navigate } from "react-router-dom";
import About from "../../features/about/About";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import BasketItem from "../../features/basket/BasketItem";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import Checkout from "../../features/checkout/Checkout";
import Contact from "../../features/contact/Contact";
import Home from "../../features/Home";
import NotFound from "../errors/NotFound";
import ServerError from "../errors/ServerError";
import App from "../layout/App";
import RequireAuth from "./RequireAuth";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <RequireAuth />,
        children: [{ path: "/checkout", element: <Checkout /> }],
      },
      { path: "", element: <Home /> },
      { path: "/catalog", element: <Catalog /> },
      { path: `/catalog/:id`, element: <ProductDetails /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/server-error", element: <ServerError /> },
      { path: "/not-found", element: <NotFound /> },
      { path: "/basket", element: <BasketItem /> },

      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "*", element: <Navigate replace to={"/not-found"} /> },
    ],
  },
]);
