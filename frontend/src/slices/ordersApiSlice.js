import { apiSlice } from "./apiSlice";
import { ORDERS_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: order,
      }),
    }),
    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: details,
      }),
    }),
    // getsslcommerzClientId: builder.query({
    //   query: () => ({
    //     url: sslcommerz_URL,
    //   }),
    //   keepUnusedDataFor: 5,
    // }),
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
    }),
    getTotalRevenue: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/revenue`,
      }),
      keepUnusedDataFor: 5,
    }),
    getSellerOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/seller`,
      }),
      keepUnusedDataFor: 5,
    }),
    getSellerRevenue: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/seller/revenue`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  // useGetsslcommerzClientIdQuery,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
  useGetTotalRevenueQuery,
  useGetSellerOrdersQuery,
  useGetSellerRevenueQuery,
} = orderApiSlice;
