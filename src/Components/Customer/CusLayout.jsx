import React from "react";
import { useLocation, matchPath, Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Banner from "./Header/Banner";

const CustLayout = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const paths = ["/login", "/signin", "/signup", "/profile"];

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
          <Footer />
        </footer>
      )}
    </>
  );
};

export default CustLayout;
