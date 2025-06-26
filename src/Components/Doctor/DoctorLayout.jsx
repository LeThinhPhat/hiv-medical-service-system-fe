import { Outlet } from "react-router-dom";
import DoctorSidebar from "./DoctorSidebar";

const DoctorLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col">
        {/* <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-700">
            Doctor Dashboard
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Dr. John Doe</span>
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </header> */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* <div className="max-w-7xl mx-auto"> */}
          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
