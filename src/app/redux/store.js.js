import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./app";
import ordersReducer from "./orders";

const store = configureStore({
  reducer: {
    app: appReducer,
    orders: ordersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
