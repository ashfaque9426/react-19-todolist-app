import { useState, ReactNode, useEffect, createContext } from "react";
import Cookies from 'js-cookie';
import { loginUrl, logoutUrl, registerUrl } from "../constants/constants";
import { useLocation, useNavigate } from "react-router";

type User = {
  userId: number,
  userEmail: string,
  userName: string
}

type LoginCredentials = {
  userEmail: string,
  userPassword: string
}

type RegisterCredentials = {
  userEmail: string,
  userName: string,
  userPassword: string,
  userConfirmPassword: string,
  recoveryStr: string
}

type ServRes = {
  userData: {
    userId: number, userEmail: string, userName: string, userSecret: string
  },
  errMsg: string | undefined
}

interface AuthContextType {
  user: User | undefined,
  setUser: (user: User) => void,
  userLoading: boolean,
  setUserLoading: (state: boolean) => void,
  isUserAvailable: boolean,
  needToVerifyEmail: boolean,
  setIsUserAvailable: (state: boolean) => void,
  login: (loginCredentials: LoginCredentials) => Promise<void>,
  logout: (userEmail: string) => Promise<void>,
  registerUser: (registerCredentials: RegisterCredentials) => Promise<void>,
}
interface ErrorHandler {
    (err: unknown): void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  // State variables to manage user authentication
  // and user data
  const [user, setUser] = useState<User | undefined>(undefined);
  const [userLoading, setUserLoading] = useState(true);
  const [isUserAvailable, setIsUserAvailable] = useState(false);
  const [needToVerifyEmail, setNeedToVerifyEmail] = useState(false);

  // To grab the location object from react-router
  // and to navigate to different routes
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";


  // error handler function to handle errors
  const handleErr: ErrorHandler = (err) => {
    if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unknown server error occurred.");
      }
  }

  // server response handler function to handle server responses
  const handleServRes = (servRes: ServRes) => {
    if (servRes.errMsg) {
        console.error(servRes.errMsg);
      } else if (servRes.userData) {
        Cookies.set('uscTDLT', servRes.userData.userSecret);
        setUser({
          userId: servRes.userData.userId,
          userName: servRes.userData.userName,
          userEmail: servRes.userData.userEmail
        });
        navigate(from, { replace: true });
      }
  }

  // login function to login user
  // and to set the user data in the state
  const login = async (userCredentials: LoginCredentials) => {
    if (!userCredentials) {
      console.log("User Credentials not provided as function parameter object.");
      return;
    }
    try {
      const stringifiedCrd = JSON.stringify(userCredentials);

      const serverRes = await fetch(`${loginUrl}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: stringifiedCrd
      })

      const { userData, errMsg } = await serverRes.json();

      handleServRes({userData, errMsg});
    } catch (err) {
      handleErr(err);
    }
  }

  // register function to register user
  // and to set the user email verification data in the state
  const registerUser = async (userCredentials: RegisterCredentials) => {
    if (!userCredentials) {
      console.log("User Credentials not provided as function parameter object.");
      return;
    }

    try {
      const stringifiedCrd = JSON.stringify(userCredentials);

      const serverRes = await fetch(`${registerUrl}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: stringifiedCrd
      })

      const { succMsg, errMsg } = await serverRes.json();

      if (errMsg) {
        console.error(errMsg);
      } else if (succMsg) {
        setNeedToVerifyEmail(true);
        navigate("/login", { replace: true });
      }
    } catch (err) {
      handleErr(err);
    }
  }

  // logout function to logout user
  // and to remove the user data from the state
  const logout = async (userEmail: string) => {
    const userSecret: string | undefined = Cookies.get('uscTDLT');
    if (!userEmail || !userSecret) {
      console.error(!userEmail ? "User Email parameter value is required to logout an user." : "User must be logged in to get logged out.");
      return;
    }

    try {
      const serverRes = await fetch(`${logoutUrl}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userEmail)
      })

      const { succMsg, errMsg } = await serverRes.json();

      if (errMsg) {
        console.error(errMsg)
      }
      else if (succMsg) {
        console.log(succMsg);
        Cookies.remove('uscTDLT');
        setUser(undefined);
        setIsUserAvailable(false);
      }
    } catch (err) {
      handleErr(err);
    }
  }

  // Check if the user is logged in or not
  // and set the user data in the state accordingly
  useEffect(() => {
    setUserLoading(true);
    const userSecret = Cookies.get('uscTDLT');
    if (user && userSecret) {
      setIsUserAvailable(true);
    } else {
      setIsUserAvailable(false);
    }
    setUserLoading(false);
  }, [user]);

  return (
    <AuthContext value={{ user, setUser, userLoading, setUserLoading, isUserAvailable, needToVerifyEmail, setIsUserAvailable, login, registerUser, logout }}>{children}</AuthContext>
  )
}

export { AuthContext, AuthProvider };