import { Outlet } from "react-router-dom";
// hoặc bất kỳ sidebar/header nào

const ManagerLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      {/* <AdminSidebar /> */}
      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default ManagerLayout;
