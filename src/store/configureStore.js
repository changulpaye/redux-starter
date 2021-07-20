import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import reducer from "./reducer";
import logger from "./middleware/logger";
import toastify from "./middleware/toastify";
import api from "./middleware/api";

export default function () {
  const store = configureStore({
    reducer,
    middleware: [
      ...getDefaultMiddleware(), // default middleware -Thunk (from dev tool kit)
      // logger({ destination: "console" }), // custom middleware
      // toastify, // show error message.
      api
    ],
  });
  return store;
}
