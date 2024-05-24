import { createBrowserRouter } from "react-router-dom";

import Root from "./../pages";

import Dashboard from "../pages/Dashboard";
import OrdersList from "../pages/Orders/OrdesList";
import CreateOrder from "../pages/Orders/CreateOrder";
import ProductsList from "../pages/Products/ProductsList";
import CreateProduct from "../pages/Products/CreateProduct";
import Tables from "../pages/Tables";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <h1>Error</h1>,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/orders/list",
        element: <OrdersList />,
      },
      {
        path: "/orders/create",
        element: <CreateOrder />,
      },
      {
        path: "/products/list",
        element: <ProductsList />,
      },
      {
        path: "/products/create",
        element: <CreateProduct />,
      },
      {
        path: "/tables",
        element: <Tables />,
      },
    ],
  },
]);
