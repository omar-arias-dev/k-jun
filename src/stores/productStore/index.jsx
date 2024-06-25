import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://127.0.0.1:3000";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/`,
  }),
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => {
        return ({
          url: "product",
          method: "GET",
        })
      },
    }),
    deleteProductById: builder.mutation({
      query: (id) => {
        return ({
          url: `product/${id}`,
          method: "DELETE",
        })
      }
    }),
    createProduct: builder.mutation({
      query: (product) => {
        return ({
          url: "product",
          method: "POST",
          body: product,
        });
      }
    }),
    updateProduct: builder.mutation({
      query: ({ id, body }) => {
        return ({
          url: `product/${id}`,
          method: "PUT",
          body: body,
        });
      }
    }),
  }),
});


export const {
  useLazyGetAllProductsQuery,
  useDeleteProductByIdMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
} = productApi;
