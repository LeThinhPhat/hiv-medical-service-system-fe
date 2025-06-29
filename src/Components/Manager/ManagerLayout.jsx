import { Outlet } from "react-router-dom";
import ManagerSidebar from "./ManagerSidebar";

const ManagerLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <ManagerSidebar />
      <div className="flex-1 flex flex-col">
        {/* <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-700">
            Manager Dashboard
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Nick Gonzalez</span>
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </header> */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;
