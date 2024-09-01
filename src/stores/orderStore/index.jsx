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
    updateOrderStatus: builder.mutation({
      query: ({ id, body }) => {
        return ({
          url: `/update-status/${id}`,
          method: "PUT",
          body,
        });
      }
    }),
    updateOrderHistory: builder.mutation({
      query: ({ id, body }) => {
        return ({
          method: "PUT",
          url: `/update-history/${id}`,
          body,
        });
      }
    }),
    getOrderById: builder.query({
      query: (id) => {
        return ({
          method: "GET",
          url: `/${id}`,
        });
      }
    }),
    updateOrderItems: builder.mutation({
      query: ({ id, body }) => {
        return ({
          method: "PUT",
          url: `/update-items/${id}`,
          body,
        });
      }
    }),
    getAllPopulatedPaginatedOrders: builder.query({
      query: ({ keyword, page, limit }) => {
        const params = {
          page,
          limit,
        }
        if (keyword !== "") {
          params.keyword = keyword;
        }
        return ({
          url: "",
          method: "GET",
          params,
          headers: { 
            'Cache-Control': 'no-cache',
          }
        });
      }
    }),
    getOrdersByType: builder.query({
      query: (type) => {
        return ({
          method: "GET",
          url: "/orders/type",
          params: { type },
          headers: { 
            'Cache-Control': 'no-cache',
          },
        });
      }
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useUpdateOrderHistoryMutation,
  useLazyGetOrderByIdQuery,
  useUpdateOrderItemsMutation,
  useLazyGetAllPopulatedPaginatedOrdersQuery,
  useLazyGetOrdersByTypeQuery,
} = orderApi;