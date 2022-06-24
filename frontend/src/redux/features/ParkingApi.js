import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ParkingApi = createApi({
  reducerPath: "parking",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:5000" }),
  tagTypes: ["Parking"],
  endpoints: (builder) => ({
    getParkingData: builder.query({
      query: () => "/parking-data",
      providesTags: ["Parking"],
    }),
    putVehicleEntry: builder.mutation({
      query: (initialEntry) => ({
        url: "/vehicle-in",
        method: "PUT",
        body: initialEntry,
      }),
      invalidatesTags: ["Parking"],
    }),
    putVehicleExit: builder.mutation({
      query: (vehicle_id) => ({
        url: "/vehicle-out",
        method: "PUT",
        body: vehicle_id,
      }),
      invalidatesTags: ["Parking"],
    }),
  }),
});

export const {
  useGetParkingDataQuery,
  usePutVehicleEntryMutation,
  usePutVehicleExitMutation,
} = ParkingApi;
