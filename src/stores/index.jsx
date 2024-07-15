import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query';

import { productApi } from "./productStore";
import { tableApi } from "./tableStore";
import { customerApi } from "./customerStore";

export const store = configureStore({
  reducer: {
    [productApi.reducerPath]: productApi.reducer,
    [tableApi.reducerPath]: tableApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware()
    .concat(productApi.middleware)
    .concat(tableApi.middleware)
    .concat(customerApi.middleware),
});

setupListeners(store.dispatch);