import { Outlet } from "react-router";
import Footer from "../components/Footer";
import NavigationBar from "../components/NavigationBar";

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
        </main>

        {/* footer component */}
        <Footer />
    </>
  )
}

export default MainLayout