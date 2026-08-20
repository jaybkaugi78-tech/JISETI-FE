import { createSlice } from "@reduxjs/toolkit";
const savedUser = JSON.parse(
  localStorage.getItem("jiseti_user") || "null"
);