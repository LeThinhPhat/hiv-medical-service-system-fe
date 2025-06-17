import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar"; // hoặc bất kỳ sidebar/header nào

const AdminLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
