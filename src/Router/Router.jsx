import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import Banner from "../components/Banner";

import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";

function RouterApp() {
  return (
    <Router>
      <Banner />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gioi-thieu" element={<About />} />
        <Route path="/lien-he" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default RouterApp;
