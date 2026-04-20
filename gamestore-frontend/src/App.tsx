//import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { useAuth } from "./hooks/useAuth";

import DiscoveryPage from "./pages/DiscoveryPage";
import ProductPage from "./pages/ProductPage";
import CustomerDashboard from "./pages/CustomerDashboard";
import StaffPortal from "./pages/StaffPortal";
import LoginPage from "./pages/LoginPage";

// ─────────────────────────────────────────────
// Protected route — redirects to "/" if not logged in
// ─────────────────────────────────────────────

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Avoid a flash-redirect while rehydrating from sessionStorage
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// ─────────────────────────────────────────────
// Staff-only route — redirects if not a staff account
// The StaffPortal page should do a deeper check; this is a first gate.
// ─────────────────────────────────────────────

function StaffRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  // Staff accounts come from a different endpoint and won't be in currentUser.
  // For now we redirect customers away. Wire up staffAuth separately when ready.
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// ─────────────────────────────────────────────
// Router
// ─────────────────────────────────────────────

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<DiscoveryPage />} />
      <Route path="/game/:id" element={<ProductPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Customer-only */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Staff-only */}
      <Route
        path="/staff"
        element={
          <StaffRoute>
            <StaffPortal />
          </StaffRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ─────────────────────────────────────────────
// Root — wraps everything in providers
// ─────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}