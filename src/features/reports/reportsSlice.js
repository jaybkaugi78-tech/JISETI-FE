import { createSlice } from "@reduxjs/toolkit";

const initialReports = [
  {
    id: "JR-001",
    type: "Red-Flag",
    title: "Misuse of public funds",
    description: "Suspected misuse of county funds in road construction.",
    location: "Nairobi, Kenya",
    latitude: -1.286389,
    longitude: 36.817223,
    status: "DRAFT",
    createdBy: "demo@jiseti.co.ke",
    createdAt: "2 hours ago",
  },
  {
    id: "JR-002",
    type: "Intervention",
    title: "Collapsed drainage system",
    description: "Drainage system has collapsed and is causing flooding.",
    location: "Kisumu, Kenya",
    latitude: -0.0917,
    longitude: 34.768,
    status: "UNDER INVESTIGATION",
    createdBy: "demo@jiseti.co.ke",
    createdAt: "5 days ago",
  },
  {
    id: "JR-003",
    type: "Red-Flag",
    title: "Bribery at local office",
    description: "Suspected bribery involving a public service.",
    location: "Mombasa, Kenya",
    latitude: -4.0435,
    longitude: 39.6682,
    status: "RESOLVED",
    createdBy: "demo@jiseti.co.ke",
    createdAt: "2 weeks ago",
  },
];

const reportsSlice = createSlice({
  name: "reports",
  initialState: { items: initialReports },
  reducers: {
    addReport: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateReport: (state, action) => {
      const index = state.items.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    deleteReport: (state, action) => {
      state.items = state.items.filter((r) => r.id !== action.payload);
    },
    updateStatus: (state, action) => {
      const report = state.items.find((r) => r.id === action.payload.id);
      if (report) report.status = action.payload.status;
    },
  },
});

export const { addReport, updateReport, deleteReport, updateStatus } =
  reportsSlice.actions;

export default reportsSlice.reducer;