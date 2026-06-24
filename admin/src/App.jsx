import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { AuthLayout, DashboardLayout } from "@layout";
import { useAuth } from "./store/authStore";

function App() {
  const { accessToken } = useAuth();

  return (
    <div className="overflow-x-hidden">
      <Routes>
        <Route
          path="/login"
          element={
            accessToken ? <Navigate to="/overview" replace /> : <AuthLayout />
          }
        />

        <Route
          path="/*"
          element={
            accessToken ? <DashboardLayout /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
