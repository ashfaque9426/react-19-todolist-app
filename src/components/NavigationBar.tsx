import { NavLink } from "react-router"
import useAuth from "../hooks/useAuth"
import NavigateButton from "./NavigateButton";
import cn from "../lib/clsx";
import Notifications from "./Notifications";

function NavigationBar() {
  const { isUserAvailable, userLoading, user, logout } = useAuth();

  return (
    <nav className="flex flex-col md:flex-row justify-between items-center px-5 py-3" role="navigation">
      <section role="region" aria-label="Logo">
        <a href="/" className="text-2xl font-bold">My List</a>
      </section>

      <ul className="flex flex-col md:flex-row items-center gap-4 mt-5 md:mt-0" role="menubar">
        {
          isUserAvailable && (
            <>
              <li>
                <NavLink to="/" end className={({ isActive }) => cn("navLinkDefault", isActive ? "text-orange-500" : "text-black")}>Home</NavLink>
              </li>
            </>
          )
        }
        <li>
          <NavLink to="/about" end className={({ isActive }) => cn("navLinkDefault", isActive ? "text-orange-500" : "text-black")}>About</NavLink>
        </li>
      </ul>

      <section className="mt-5 md:mt-auto" role="region" aria-label="User Authentication">
        {userLoading && <p className="text-lg">Loading...</p>}
        {(isUserAvailable && user) ? (
          <div className="flex gap-5 items-center">
            <span className="text-lg font-semibold">
              {user.userName}
            </span>
            <span>
              <Notifications />
            </span>
            <span className="text-lg">
              <button className="btn-primary" onClick={() => logout(user.userEmail)}>Logout</button>
            </span>
          </div>
        ) : (
          <ul className="flex gap-5">
            <li>
              <NavigateButton navigateTo="/login" btnStyles="text-lg">Login</NavigateButton>
            </li>
            <li>
              <NavigateButton navigateTo="/register" btnStyles="text-lg">Register</NavigateButton>
            </li>
          </ul>
        )}
      </section>
    </nav>
  )
}

export default NavigationBar;