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

/////
import Staff from "../Components/Staff/Staff";
import AppointmentList from "../Components/Staff/AppointmentList";

////
import Manager from "../Components/Manager/Manager";
import Doctor from "../Components/Doctor/Doctor";
import AppointmentFake from "../Components/Doctor/AppointmentFake";
import ProfileDoctor from "../Components/Doctor/ProfileDoctor";
import BookingPage from "../Components/Customer/BookingStep/BookingPage";
import BookingConfirmPage from "../Components/Customer/BookingStep/BookingConfirmPage";

import PatientsList from "../Components/Doctor/PatientsList";
// import DoctorProfile from "../Components/Doctor/DoctorProfile";
import DoctorSlot from "../Components/Staff/DoctorSlot";
import DoctorProfile from "../Components/Doctor/DoctorProfile";
import MedicalRecords from "../Components/Doctor/MedicalRecords";
import DoctorSlotList from "../Components/Doctor/DoctorSlotList";
import DoctorSchedule from "../Components/Doctor/DoctorSchedule";
import DoctorAppointments from "../Components/Doctor/DoctorAppoinment";
import CreateMedicalRecord from "../Components/Doctor/CreateMedicalRecord";
import ViewMedicalRecord from "../Components/Doctor/ViewMedicalRecord";
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
      { path: "/staff/appointmentlist", element: <AppointmentList /> },
      { path: "/staff/schedule", element: <DoctorSlot /> },
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
      { path: "appointments", element: <AppointmentFake /> },
      { path: "my-patients", element: <PatientsList /> },
      {
        path: "profile-doctor",
        element: <ProfileDoctor />,
      },
      {
        path: "profile",
        element: <DoctorProfile />,
      },
      {
        path: "medicallist",
        element: <MedicalRecords />,
      },
      {
        path: "doctorslot",
        element: <DoctorSlotList />,
      },
      {
        path: "doctorschedule",
        element: <DoctorSchedule />,
      },
      {
        path: "doctorsappoinment",
        element: <DoctorAppointments />,
      },
      {
        path: "doctorsappoinment/medical-records/create/:patientID",
        element: <CreateMedicalRecord />,
      },
      {
        path: "doctorsappoinment/medical-records/view/:patientID",
        element: <ViewMedicalRecord />,
      },
    ],
  },
  {
    path: "*",
    element: <div>Not Found</div>,
  },
]);

export default Router;
