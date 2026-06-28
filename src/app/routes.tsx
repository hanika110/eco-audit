import { createBrowserRouter, Navigate } from "react-router";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ComponentShowcase from "./pages/ComponentShowcase";
import LogoDemo from "./pages/LogoDemo";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/analytics",
    element: (
      <ProtectedRoute>
        <Analytics />
      </ProtectedRoute>
    ),
  },
  {
    path: "/showcase",
    Component: ComponentShowcase,
  },
  {
    path: "/logo",
    Component: LogoDemo,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
