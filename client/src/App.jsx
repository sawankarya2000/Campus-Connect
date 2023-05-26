import React, { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Explore from "./pages/explore";

import PrivateRoute from "./routes/PrivateRoute";
import Signup from "./pages/signup";
import Profile from "./pages/profile";
import Assignment from "./pages/assignment";
import SearchResults from "./pages/searchResults";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Explore />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/assignment" element={<Assignment />} />
          <Route path="/search/:id" element={<SearchResults />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
