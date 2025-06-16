// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Banner from "./Page/Banner";
// import Header from "./Page/Header";
// import Footer from "./Page/Footer";
// import Homepage from "./Components/Customer/Homepage";
// import Booking from "./Components/Customer/Booking";
// import SignIn from "./Page/SignIn";
// import SignUp from "./Page/SignUp";
// import ForgotPassword from "./Page/ForgotPassword";
// import ListDoctor from "./Components/Customer/Listdoctor";
// import DetailDoctor from "./Components/Customer/Detaildoctor";
// import BlogList from "./Components/Customer/BlogList";
// import BlogDetail from "./Components/Customer/BlogDetail";
// import { AuthProvider } from "./Services/AuthContext";
// function App() {
//   return (
//     <AuthProvider>
//     <Router>
//       <Banner />
//       <Header />

//       <main>

//         <Routes>
//           <Route path="/" element={<Homepage />} />
//           <Route path="/blogs" element={<BlogList />} />
//           <Route path="blogs/:id" element={<BlogDetail />} />
//           <Route path="/booking" element={<Booking />} />
//           <Route path="/signin" element={<SignIn />} />
//           <Route path="/register" element={<SignUp />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/news" element={<ListDoctor />} />
//           <Route path="/news/:id" element={<DetailDoctor />} />
//         </Routes>
//       </main>
//       <Footer />
//     </Router>
//     </AuthProvider>
//   );
// }

// export default App;
import { RouterProvider } from "react-router-dom";
import Router from "./Router/Router";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./Services/AuthContext";

function App() {
  return (
    <AuthProvider>
     <Toaster position="top-center" />
      <RouterProvider router={Router} />
    </AuthProvider>
  );
}

export default App;
