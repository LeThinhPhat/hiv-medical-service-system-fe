import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Banner from "./Page/Banner";
import Header from "./Page/Header";
import Footer from "./Page/Footer";
import Homepage from "./Components/Customer/Homepage";
import Booking from "./Components/Customer/Booking";
import SignIn from "./Page/SignIn";
import SignUp from "./Page/SignUp";
function App() {
  return (
    <Router>
      <Banner />
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;
