// src/routes/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getMe } from "../api/customers";

export default function ProtectedRoute({ children, redirectTo = "/login" }) {
  const [state, setState] = useState({ loading: true, authenticated: false });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await getMe(); // { authenticated: true/false, ... }
        if (mounted) setState({ loading: false, authenticated: !!me?.authenticated });
      } catch (e) {
        if (mounted) setState({ loading: false, authenticated: false });
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (state.loading) return <div style={{ padding: 16 }}>확인 중...</div>;
  if (!state.authenticated) return <Navigate to={redirectTo} replace />;
  return children;
}
