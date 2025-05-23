// pensar esto como la maquina expendedora, quiero una lata, pero quiero una lata de fanta no cualquiera

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;