import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserDashboard from "./pages/dashboard/UserDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import NgoDashboard from "./pages/dashboard/NgoDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./App.css";

// Define routes
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        {/* Navbar only for Home page */}
        <Navbar />
        <div className="home-container">
          <Home />
        </div>
        <Footer />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Login />
      </>
    ),
  },
  {
    path: "/signup",
    element: (
      <>
        <Signup />
      </>
    ),
  },
  {
    path: "/dashboard/:slug",
    element: (
      <>
       <UserDashboard />
        <Footer />
      </>
    ),
  },
  {
    path: "/admin-dashboard/:slug",
    element: (
      <>
        <AdminDashboard />
        <Footer />
      </>
    ),
  },
  {
    path: "/ngo-dashboard/:slug",
    element: (
      <>
        <NgoDashboard />
        <Footer />
      </>
    ),
  },
  {
    path: "*",
    element: <h1>404 - Page Not Found</h1>,
  },
  
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
