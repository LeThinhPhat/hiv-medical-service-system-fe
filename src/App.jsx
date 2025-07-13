import { RouterProvider } from "react-router-dom";
import Router from "./Router/Router";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./Services/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <RouterProvider router={Router} />
    </AuthProvider>
  );
}

export default App;
