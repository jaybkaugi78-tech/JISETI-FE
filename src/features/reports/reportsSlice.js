import { createSlice } from "@reduxjs/toolkit";

const initialReports = [
  // your report objects
];

const reportsSlice = createSlice({
  name: "reports",
  initialState: { items: initialReports },
  reducers: {},
});