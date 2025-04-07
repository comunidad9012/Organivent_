import { createSlice } from "@reduxjs/toolkit";
import { persistLocalStorage, clearLocalStorage } from "../utilities/localStorage.utility"; //fijarse si esta bien

export const UserKey = 'user';

const EmptyUserState = {
  nombre_usuario: null,
  // token: sessionStorage.getItem("token") || null, //como puede ser que el token ya tenga un valor y no el usuario?
  rol: null
};

const userSlice = createSlice({
  name: "user", 
  initialState: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : EmptyUserState, //si ya tenemos datos en el localStorage usar esos para inicializar, sino no
  reducers: {
    createUser: (state, action) => {
      persistLocalStorage(UserKey, action.payload);
      return action.payload;
    },
    updateUser: (state, action) => {
      const result = { ...state, ...action.payload };
      persistLocalStorage(UserKey, result);
      return result;
    },
    resetUser: () => {
      clearLocalStorage(UserKey);
      return EmptyUserState;



    // loginSuccess: (state, action) => {
    //   state.nombre_usuario = action.payload.nombre_usuario;
    //   state.admin = action.payload.admin;
    //   // state.token = action.payload.token;
    //   // sessionStorage.setItem("token", action.payload.token);
    // },
    // logout: (state) => {
    //   state.nombre_usuario = null;
    //   state.token = null;
    //   // sessionStorage.removeItem("token");

    //   //aca puedo poner initialState en vez de null

    },
  },
});

export const { createUser, updateUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
