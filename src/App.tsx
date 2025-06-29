import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/pages/dashboard/Dashboard";
import Authors from "./components/pages/authors";
import Students from "./components/pages/students/index";
import DashboardLayout from "./components/layout/DashboardLayout";
import LoginPage from "./components/pages/login";
import { ToastContainer } from "react-toastify";
import AuthContextProvider from "./context/authContext";
import Users from "./components/pages/users";
import UserDetails from "./components/pages/users/userDetails";
import Categories from "./components/pages/categories";
import Fragments from "./components/pages/fragments";
import Comments from "./components/pages/comments";

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
            <Route path="users" Component={Users} />
            <Route path="users/:userId" Component={UserDetails} />
            <Route path="categories" Component={Categories} />
            <Route path="fragments" Component={Fragments} />
            <Route path="comments" Component={Comments} />
            <Route path="comments" Component={Comments} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
};

export default App;
