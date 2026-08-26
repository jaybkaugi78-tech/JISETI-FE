import { createSlice } from "@reduxjs/toolkit";

const reportsSlice = createSlice({
  name: "reports",

  initialState: {
    items: [],
    loading: false,
    error: null,
  },

  reducers: {
    setReports: (state, action) => {
      state.items = action.payload;
    },

    addReport: (state, action) => {
      state.items.unshift(action.payload);
    },

    updateReport: (state, action) => {
      const index = state.items.findIndex(
        (report) => report.id === action.payload.id
      );

      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },

    deleteReport: (state, action) => {
      state.items = state.items.filter(
        (report) => report.id !== action.payload
      );
    },

    updateStatus: (state, action) => {
      const report = state.items.find(
        (report) => report.id === action.payload.id
      );

      if (report) {
        report.status = action.payload.status;
      }
    },

    setReportsLoading: (state, action) => {
      state.loading = action.payload;
    },

    setReportsError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setReports,
  addReport,
  updateReport,
  deleteReport,
  updateStatus,
  setReportsLoading,
  setReportsError,
} = reportsSlice.actions;

export default reportsSlice.reducer;