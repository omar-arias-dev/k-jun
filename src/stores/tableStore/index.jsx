import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://127.0.0.1:3000";
const TABLE = "table";

export const tableApi = createApi({
  reducerPath: "tableApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/${TABLE}`,
  }),
  endpoints: (builder) => ({
    getAllTables: builder.query({
      query: () => {
        return ({
          method: "GET",
          headers: { 
            'Cache-Control': 'no-cache', // Solve Error 304.
           },
        });
      }
    }),
    createTable: builder.mutation({
      query: (body) => {
        return ({
          method: "POST",
          body,
        });
      }
    }),
    updateTableById: builder.mutation({
      query: ({ id, body }) => {
        return ({
          url: `/${id}`,
          method: "PUT",
          body,
        });
      }
    }),
    deleteTable: builder.mutation({
      query: (id) => {
        return ({
          url: `/${id}`,
          method: "DELETE",
        });
      }
    }),
    tableToTaken: builder.mutation({
      query: ({id, body}) => {
        return ({
          url: `/to-taken/${id}`,
          method: "PUT",
          body,
        });
      }
    }),
    tableToAvailable: builder.mutation({
      query: ({id, body}) => {
        return ({
          url: `/to-available/${id}`,
          method: "PUT",
          body,
        });
      }
    }),
    cancelOrderTable: builder.mutation({
      query: (id) => {
        return ({
          url: `/cancel-order-table/${id}`,
          method: "PUT",
        });
      }
    }),
  }),
});

export const {
  useLazyGetAllTablesQuery,
  useCreateTableMutation,
  useUpdateTableByIdMutation,
  useDeleteTableMutation,
  useTableToTakenMutation,
  useTableToAvailableMutation,
  useCancelOrderTableMutation,
} = tableApi;