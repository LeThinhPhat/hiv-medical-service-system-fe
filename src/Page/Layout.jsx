import { matchPath, Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Banner from "./Banner";
import BookingStepper from "../Components/Customer/BookingStepper";
function Layout() {
  const location = useLocation();
  const pathname = location.pathname;

  const paths = ["/signin", "/register", "/forgot-password", "/profile"];

  const hideHeaderFooter = paths.some((path) => matchPath(path, pathname));

  return (
    <>
      {!hideHeaderFooter && (
        <header>
          <Banner />
          <Header />
        </header>
      )}
      <main className="min-h-screen">
        <Outlet />
      </main>
      {!hideHeaderFooter && (
        <footer>
          <BookingStepper />
          <Footer />
        </footer>
      )}
    </>
  );
}

export default Layout;
