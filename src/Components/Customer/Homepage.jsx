import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

const HomePage = () => {
  return (
    <div className="font-sans">
      {/* Banner */}
      <div
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center text-white text-center"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/4266931/pexels-photo-4266931.jpeg)",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
            Welcome to MedicalCare
          </h1>
          <p className="text-lg md:text-xl mb-6 drop-shadow-md">
            Your Health, Our Priority
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105">
            Book Appointment
          </button>
        </div>
      </div>

      {/* Services */}
      <div className="max-w-7xl mx-auto my-12 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {["General Checkup", "Cardiology", "Neurology", "Pediatrics"].map(
            (service) => (
              <div
                key={service}
                className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {service}
                </h3>
                <p className="text-gray-600">
                  High-quality care with our experienced doctors in{" "}
                  {service.toLowerCase()}.
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* About */}
      <div className="max-w-7xl mx-auto my-12 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          About Us
        </h2>
        <p className="text-gray-600 leading-relaxed">
          MedicalCare is a leading provider of healthcare services with a
          mission to deliver compassionate, patient-centered care. We offer a
          full range of medical services using modern technology.
        </p>
      </div>
    </div>
  );
};
export default HomePage;
