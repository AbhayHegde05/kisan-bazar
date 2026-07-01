import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const Layout = () => {
  const { loading: authLoading, token } = useSelector((state) => state.auth);

  // Only show a full-screen loader when we have a token and are fetching user data.
  // Never block unauthenticated users from seeing the app.
  if (authLoading && token) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
