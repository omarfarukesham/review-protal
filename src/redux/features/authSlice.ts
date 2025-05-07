import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type TUser = {
  name: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
};

export type TAuthState = {
  user: TUser | null;
  token: string | null;
};

const initialState: TAuthState = {
    user: null,
    token: null,
  };
  

const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      localStorage.setItem('accessToken', token)
      state.user = user;
      state.token = token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentUser = (state: RootState) => state.auth.user;
