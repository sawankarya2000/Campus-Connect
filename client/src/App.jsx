import React, { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// const SignIn = lazy(() => import("./components/signin"));
// const Login = lazy(() => import("./components/login"));
import Login from "./pages/login";
import Explore from "./pages/explore";

import PrivateRoute from "./routes/PrivateRoute";
import Signup from "./pages/signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Explore />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
