import { createBrowserRouter } from "react-router-dom";

// Layouts
import Layout from "../Page/Layout";
import AdminLayout from "../Components/Admin/AdminLayout";
import StaffLayout from "../Components/Staff/StaffLayout";
import ManagerLayout from "../Components/Manager/ManagerLayout";
import DoctorLayout from "../Components/Doctor/DoctorLayout";

// Customer Pages
import Homepage from "../Components/Customer/Homepage";
import Booking from "../Components/Customer/Booking";
import SignIn from "../Page/SignIn";
import SignUp from "../Page/SignUp";
import ForgotPassword from "../Page/ForgotPassword";
import ListDoctor from "../Components/Customer/Listdoctor";
import DetailDoctor from "../Components/Customer/DetailDoctor";
import BlogList from "../Components/Customer/BlogList";
import BlogDetail from "../Components/Customer/BlogDetail";
import Profile from "../Page/Profile";
import About from "../Page/About";
import BookingApm from "../Components/Customer/BookingApm";

// Admin/Staff/Manager/Doctor main pages
import Admin from "../Components/Admin//Admin";
import Staff from "../Components/Staff/Staff";
import Manager from "../Components/Manager/Manager";
import Doctor from "../Components/Doctor/Doctor";
import Appointment from "../Components/Doctor/Appointment";
import  BookingPage from "../Components/Customer/BookingStep/BookingPage";
import BookingConfirmPage from "../Components/Customer/BookingStep/BookingConfirmPage";
const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Homepage /> },
      { path: "about", element: <About /> },
      { path: "blogs", element: <BlogList /> },
      { path: "blogs/:id", element: <BlogDetail /> },
      { path: "booking", element: <Booking /> },
      { path: "profile", element: <Profile /> },
      { path: "signin", element: <SignIn /> },
      { path: "register", element: <SignUp /> },
      { path: "/book/:doctorId", element: <BookingPage /> },
      { path: "/booking/confirm", element: <BookingConfirmPage /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "docs", element: <ListDoctor /> },
      { path: "docs/:id", element: <DetailDoctor /> },
      { path: "book", element: <BookingApm /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "", element: <Admin /> },
      // Add admin child routes here if needed
    ],
  },
  {
    path: "/staff",
    element: <StaffLayout />,
    children: [
      { path: "", element: <Staff /> },
      // Add staff child routes here if needed
    ],
  },
  {
    path: "/manager",
    element: <ManagerLayout />,
    children: [
      { path: "", element: <Manager /> },
      // Add manager child routes here if needed
    ],
  },
  {
    path: "/doctor",
    element: <DoctorLayout />,
    children: [
      { path: "", element: <Doctor /> },
      { path: "appointments", element: <Appointment /> },
    ],
  },
  {
    path: "*",
    element: <div>Not Found</div>,
  },
]);

export default Router;
