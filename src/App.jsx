import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Landing from "./pages/public/Landing";
import PublicReports from "./pages/public/PublicReports";
import PublicReportDetail from "./pages/public/PublicReportDetail";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/user/Dashboard";
import MyReports from "./pages/user/MyReports";
import NewReport from "./pages/user/NewReport";
import ReportDetail from "./pages/user/ReportDetail";
import Profile from "./pages/user/Profile";
import Notifications from "./pages/user/Notifications";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReportDetail from "./pages/admin/AdminReportDetail";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

import MainLayout from "./components/layout/MainLayout";


export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Landing />
        }
      />

      <Route
        path="/login"
        element={
          <Login />
        }
      />

      <Route
        path="/register"
        element={
          <Register />
        }
      />

      <Route
        path="/public/reports"
        element={
          <PublicReports />
        }
      />

      <Route
        path="/public/reports/:id"
        element={
          <PublicReportDetail />
        }
      />

      <Route
        element={
          <ProtectedRoute />
        }
      >
        <Route
          element={
            <MainLayout />
          }
        >
          <Route
            path="/dashboard"
            element={
              <Dashboard />
            }
          />

          <Route
            path="/reports"
            element={
              <MyReports />
            }
          />

          <Route
            path="/reports/new"
            element={
              <NewReport />
            }
          />

          <Route
            path="/reports/:id/edit"
            element={
              <NewReport />
            }
          />

          <Route
            path="/reports/:id"
            element={
              <ReportDetail />
            }
          />

          <Route
            path="/profile"
            element={
              <Profile />
            }
          />

          <Route
            path="/notifications"
            element={
              <Notifications />
            }
          />
        </Route>
      </Route>

      <Route
        element={
          <AdminRoute />
        }
      >
        <Route
          element={
            <MainLayout admin />
          }
        >
          <Route
            path="/admin"
            element={
              <AdminDashboard />
            }
          />

          <Route
            path="/admin/reports/:id"
            element={
              <AdminReportDetail />
            }
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}