import React, { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// const SignIn = lazy(() => import("./components/signin"));
// const Login = lazy(() => import("./components/login"));
import Login from "./components/login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
