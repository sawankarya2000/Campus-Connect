import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authorized: JSON.parse(localStorage.getItem("authorized"))
    ? JSON.parse(localStorage.getItem("authorized"))
    : false,
  data: JSON.parse(localStorage.getItem("userData"))
    ? JSON.parse(localStorage.getItem("userData"))
    : {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthorized: (state, action) => {
      localStorage.setItem("authorized", true);
      state.authorized = action.payload;
    },
    setData: (state, action) => {
      localStorage.setItem("userData", action.payload);
      state.data = action.payload;
    },
  },
});

export const { setAuthorized, setData } = authSlice.actions;
export default authSlice.reducer;
