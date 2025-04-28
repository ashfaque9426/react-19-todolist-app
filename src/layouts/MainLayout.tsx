import { Outlet, useLocation, useNavigate } from "react-router"
import Footer from "../components/Footer"
import NavigationBar from "../components/NavigationBar"
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

function MainLayout() {
  const auth = useAuth();
  const isUserAvailable = auth?.isUserAvailable;
  const userLoading = auth?.userLoading;
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is available and if so set the user data in the state
    if (!userLoading && !isUserAvailable) {
      navigate("/login", { replace: true });
    } else if (!userLoading && isUserAvailable) {
      // If the user is available, navigate to the main page
      navigate(from, { replace: true });
    }
  }, [userLoading, isUserAvailable, from, navigate]);

  return (
    <>
        {/* header component */}
        <header aria-label="Website Header and Navigation">
            <NavigationBar />
        </header>

        {/* main component */}
        <main role="main" className="px-0.5 md:px-3.5 lg:px-5" aria-labelledby="main-component">
            <Outlet />
        </main>

        {/* footer component */}
        <Footer />
    </>
  )
}

export default MainLayout