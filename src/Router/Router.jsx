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

import Admin from "../Components/Admin//Admin";
import Staff from "../Components/Staff/Staff";
import AppointmentList from "../Components/Staff/AppointmentList";

import Manager from "../Components/Manager/Manager";
import ManagerDoctorList from "../Components/Manager/ManagerDoctorList";
import Doctor from "../Components/Doctor/Doctor";
import AppointmentFake from "../Components/Doctor/AppointmentFake";
import BookingPage from "../Components/Customer/BookingStep/BookingPage";
import BookingConfirmPage from "../Components/Customer/BookingStep/BookingConfirmPage";

import PatientsList from "../Components/Doctor/PatientsList";
import DoctorSlot from "../Components/Staff/DoctorSlot";
import DoctorProfile from "../Components/Doctor/DoctorProfile";
import MedicalRecords from "../Components/Doctor/MedicalRecords";
import DoctorSlotList from "../Components/Doctor/DoctorSlotList";
import DoctorSchedule from "../Components/Doctor/DoctorSchedule";
import DoctorAppointments from "../Components/Doctor/DoctorAppoinment";
import CreateMedicalRecord from "../Components/Doctor/CreateMedicalRecord";
import BookingPaymentPage from "../Components/Customer/BookingStep/BookingPayment";
import SuccessPaymentPage from "../Components/Customer/BookingStep/SuccessPaymentPage";
import CreateDoctorSchedule from "../Components/Manager/CreateDoctorSchedule";
import ManagerAppointment from "../Components/Manager/ManagerAppointment";
import Calendar from "../Components/Doctor/Calendar";
import ViewMedicalRecord from "../Components/Doctor/ViewMedicalRecord";
import ManagerPatient from "../Components/Manager/ManagerPatient";
import ManagerService from "../Components/Manager/ManagerService";
import ManagerUser from "../Components/Manager/ManagerUser";
import UserDetail from "../Components/Manager/UserDetail";
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
      { path: "booking-payment", element: <BookingPaymentPage /> },
      { path: "profile", element: <Profile /> },
      { path: "signin", element: <SignIn /> },
      { path: "register", element: <SignUp /> },
      { path: "/book/:doctorId", element: <BookingPage /> },
      { path: "/booking/confirm", element: <BookingConfirmPage /> },
      { path: "/payments/vnpay-return", element: <SuccessPaymentPage /> },
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
      { path: "doctors", element: <CreateDoctorSchedule /> },
      { path: "doctorlist", element: <ManagerDoctorList /> },
      { path: "appointments", element: <ManagerAppointment /> },
      { path: "patient", element: <ManagerPatient /> },
      { path: "service", element: <ManagerService /> },
      { path: "user", element: <ManagerUser /> },
      { path: "user/:id", element: <UserDetail /> },
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
        path: "calendar",
        element: <Calendar />,
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
        path: "doctorsappoinment/medical-records/personal-id/:patientID",
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
