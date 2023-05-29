import * as React from "react";
import { Navigate } from "https://esm.sh/react-router-dom@6.11.2";
const ProtectedRoute = ({ isLoggedIn, children }: any) => {
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};
export default ProtectedRoute;