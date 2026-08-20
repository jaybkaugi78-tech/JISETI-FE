import { createSlice } from "@reduxjs/toolkit";

const initialReports = [
  // your report objects
];

const reportsSlice = createSlice({
  name: "reports",
  initialState: { items: initialReports },
  reducers: {},
});
addReport: (state, action) => {
  state.items.unshift(action.payload);
},updateReport: (state, action) => {
  const index = state.items.findIndex((r) => r.id === action.payload.id);
  if (index !== -1) state.items[index] = action.payload;
},

