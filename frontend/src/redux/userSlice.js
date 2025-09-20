import { createSlice } from "@reduxjs/toolkit";
// import { persistLocalStorage, clearLocalStorage } from "../utilities/localStorage.utility";

export const UserKey = 'user';

const EmptyUserState = {
  id: null,
  nombre_usuario: null,
  email: null,
  rol: null,
  isAuthenticated: false
};

const userSlice = createSlice({
  name: "user", 
  // initialState: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : EmptyUserState, //si ya tenemos datos en el localStorage usar esos para inicializar, sino no
  initialState: EmptyUserState,
  reducers: {
    createUser: (state, action) => {
      state.id = action.payload.id
      state.nombre_usuario = action.payload.nombre_usuario
      state.rol = action.payload.rol
      state.isAuthenticated = true
      state.email = action.payload.email
      // persistLocalStorage(UserKey, action.payload); | esto era lo que tenia con el localstorage
      // return action.payload;
    },
    // updateUser: (state, action) => {
    //   const result = { ...state, ...action.payload };
    //   persistLocalStorage(UserKey, result);
    //   return result;
    // },
    resetUser: (state) => {
      return EmptyUserState
    },
  },
});

export const { createUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
