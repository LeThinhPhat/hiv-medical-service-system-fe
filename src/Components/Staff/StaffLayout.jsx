import { Outlet } from "react-router-dom";
import StaffSidebar from "./StaffSidebar";

const StaffLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <StaffSidebar />
      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default StaffLayout;
