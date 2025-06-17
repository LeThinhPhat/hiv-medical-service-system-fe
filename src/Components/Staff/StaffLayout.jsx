import { Outlet } from "react-router-dom";

const StaffLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      {/* <AdminSidebar /> */}
      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default StaffLayout;
