import { createSlice } from "@reduxjs/toolkit";

const savedUser = JSON.parse(
  localStorage.getItem("jiseti_user") || "null"
);

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: savedUser,
    token: localStorage.getItem("jiseti_token"),
  },

  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      localStorage.setItem(
        "jiseti_user",
        JSON.stringify(action.payload.user)
      );

      localStorage.setItem(
        "jiseti_token",
        action.payload.token
      );
    },

    logout: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem("jiseti_user");
      localStorage.removeItem("jiseti_token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;