import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://127.0.0.1:3000";
const CUSTOMER = "customer";

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/${CUSTOMER}`,
  }),
  endpoints: (builder) => ({
    getAllCustomers: builder.query({
      query: () => {
        return ({
          method: "GET",
          headers: { 
            'Cache-Control': 'no-cache', // Solve Error 304.
           },
        });
      }
    }),
    createCustomer: builder.mutation({
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
  useLazyGetAllCustomersQuery,
  useCreateCustomerMutation,
} = customerApi;