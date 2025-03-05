import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/pages/dashboard/Dashboard";
import Authors from "./components/pages/authors";
import Students from "./components/pages/students/index";
import DashboardLayout from "./components/layout/DashboardLayout";
import LoginPage from "./components/pages/login";
import { ToastContainer } from "react-toastify";
import AuthContextProvider from "./context/authContext";

const App = () => {
  return (
    <AuthContextProvider>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={LoginPage} />
          <Route path="/dashboard" Component={DashboardLayout}>
            <Route path="" Component={Dashboard} />
            <Route path="authors" Component={Authors} />
            <Route path="students" Component={Students} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
};

export default App;
