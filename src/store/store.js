import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import reportsReducer from "../features/reports/reportsSlice";
import usersReducer from "../features/users/usersSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reports: reportsReducer,
    users: usersReducer,
    notifications: notificationsReducer,
  },

  // Customize the default middleware (thunk, serializability checks, etc.)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore specific action types if you're storing non-serializable
        // values (like Dates or File objects) in certain actions
        ignoredActions: ["auth/setUser"],
      },
    }),

  // Enable Redux DevTools only outside production
  devTools: process.env.NODE_ENV !== "production",
});

// Optional: export types/helpers if you later add TypeScript
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;