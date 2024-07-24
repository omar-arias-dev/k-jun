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
    tableToTaken: builder.mutation({
      query: ({id, body}) => {
        return ({
          url: `/to-taken/${id}`,
          method: "PUT",
          body,
        });
      }
    }),
  }),
});

export const {
  useLazyGetAllTablesQuery,
  useCreateTableMutation,
  useTableToTakenMutation,
} = tableApi;