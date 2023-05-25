import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const isAuthorized = useSelector((state) => state.auth.authorized);

  return isAuthorized ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
