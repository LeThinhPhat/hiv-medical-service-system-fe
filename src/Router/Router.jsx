import { createBrowserRouter } from "react-router-dom";
import Layout from "../Page/Layout";
import Homepage from "../Components/Customer/Homepage";
import Booking from "../Components/Customer/Booking";
import SignIn from "../Page/SignIn";
import SignUp from "../Page/SignUp";
import ForgotPassword from "../Page/ForgotPassword";
import ListDoctor from "../Components/Customer/Listdoctor";
import DetailDoctor from "../Components/Customer/DetailDoctor";
import BlogList from "../Components/Customer/BlogList";
import BlogDetail from "../Components/Customer/BlogDetail";
import TestAPI from "../Page/TestAPI";
import TestAPI2 from "../Page/TestAPI2";
import Profile from "../Page/Profile";
import About from "../Page/About";
import Staff from "../Page/Staff/Staff";
import Doctor from "../Page/Doctor/Doctor";
import Manager from "../Page/Manager/Manager";
import Admin from "../Page/Admin/Admin";
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
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "news", element: <ListDoctor /> },
      { path: "doctor", element: <Doctor/> },
      { path: "staff", element: <Staff/> },
      { path: "manager", element: <Manager/> },
      { path: "admin", element: <Admin/> },
      { path: "news/:id", element: <DetailDoctor /> },
      { path: "test", element: <TestAPI /> },
      { path: "test/:id", element: <TestAPI2 /> },
    ],
  },
  { path: "*", element: <div>Not Found</div> },
]);

export default Router;
