import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://127.0.0.1:3000";
const ADDRESS = "address";

export const addressApi = createApi({
  reducerPath: "addressApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/${ADDRESS}`,
  }),
  endpoints: (builder) => ({
    getAllCustomerAddresses: builder.query({
      query: (customerId) => {
        return ({
          method: "GET",
          url: `/customer/${customerId}`,
          headers: { 
            'Cache-Control': 'no-cache',
          },
        });
      }
    }),
    createAddress: builder.mutation({
      query: (address) => {
        return ({
          method: "POST",
          body: address,
        });
      },
    }),
  }),
});

export const {
  useLazyGetAllCustomerAddressesQuery,
  useCreateAddressMutation,
} = addressApi;