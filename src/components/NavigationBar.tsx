import { NavLink } from "react-router"
import useAuth from "../hooks/useAuth"

function NavigationBar() {
  const { isUserAvailable, userLoading, user, logout } = useAuth();

  return (
    <nav className="flex flex-col md:flex-row justify-between items-center px-5 py-3" role="navigation">
      <section role="region" aria-label="Logo">
        <a href="/" className="text-2xl font-bold">Todo List</a>
      </section>

      <ul>
        <li>
          <NavLink to="/" className="text-lg" end>Home</NavLink>
        </li>
      </ul>

      <section role="region" aria-label="User Authentication">
      {userLoading && <li className="text-lg">Loading...</li>}
          {(isUserAvailable && user) ? (
            <div className="flex gap-5">
              <span className="text-lg">
                {user.userName}
              </span>
              <span className="text-lg">
                <button onClick={() => logout(user.userEmail)}>Logout</button>
              </span>
            </div>
          ) : (
            <ul className="flex gap-5">
              <li>
                <NavLink to="/login" className="text-lg">Login</NavLink>
              </li>
              <li>
                <NavLink to="/register" className="text-lg">Register</NavLink>
              </li>
            </ul>
          )
          }
      </section>
    </nav>
  )
}

export default NavigationBar