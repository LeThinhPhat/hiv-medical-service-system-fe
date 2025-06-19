import { Outlet } from "react-router-dom";
import DoctorSidebar from "./DoctorSidebar";
const DoctorLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <DoctorSidebar />
      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default DoctorLayout;
