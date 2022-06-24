import { configureStore } from "@reduxjs/toolkit";
import { ParkingApi } from "./features/ParkingApi";

export const store = configureStore({
  reducer: {
    [ParkingApi.reducerPath]: ParkingApi.reducer,
  },
});
