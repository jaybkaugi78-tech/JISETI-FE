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
},deleteReport: (state, action) => {
  state.items = state.items.filter((r) => r.id !== action.payload);
},updateStatus: (state, action) => {
  const report = state.items.find((r) => r.id === action.payload.id);
  if (report) report.status = action.payload.status;
},export const { addReport, updateReport, deleteReport, updateStatus } =
  reportsSlice.actions;

export default reportsSlice.reducer;



