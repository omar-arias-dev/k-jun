import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://127.0.0.1:3000";
const ORDER = "order";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/${ORDER}`,
  }),
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (body) => {
        return ({
          method: "POST",
          body,
        });
      }
    }),
  }),
});

export const {
  useCreateOrderMutation,
} = orderApi;