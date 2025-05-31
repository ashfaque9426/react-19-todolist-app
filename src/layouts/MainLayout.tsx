import { Outlet } from "react-router";
import Footer from "../components/Footer";
import NavigationBar from "../components/NavigationBar";
import { ToastContainer } from "react-toastify";

function MainLayout() {
  return (
    <>
      {/* header component */}
      <header aria-label="Website Header and Navigation">
        <NavigationBar />
      </header>

      {/* main component */}
      <main role="main" aria-labelledby="main-component">
        <Outlet />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </main>

      {/* footer component */}
      <Footer />
    </>
  )
}

export default MainLayout