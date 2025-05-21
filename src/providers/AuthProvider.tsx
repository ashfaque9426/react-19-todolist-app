import { useState, ReactNode, useEffect, createContext, useCallback } from "react";
import Cookies from 'js-cookie';
import { loginUrl, logoutUrl, registerUrl } from "../constants/constants";
import { decodeJwt } from "jose"
import { refreshAccessToken, showToast } from "../services/utils";
import { LoginCredentials, RegisterCredentials, ServResUserLoginData, User } from "../services/dataTypes";
import { AuthContextType, ErrorHandler } from "../services/interfaces";

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  // State variables to manage user authentication
  // and user data
  const [user, setUser] = useState<User | undefined>(undefined);
  const [userLoading, setUserLoading] = useState(true);
  const [isUserAvailable, setIsUserAvailable] = useState(false);
  const [needToVerifyEmail, setNeedToVerifyEmail] = useState(false);
  const [timeOutIdArr, setTimeOutIdArr] = useState<NodeJS.Timeout[]>([]);

  // error handler function to handle errors
  const handleErr: ErrorHandler = useCallback((err) => {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error("An unknown server error occurred.");
    }
  }, []);

  // server response handler function to handle server responses
  const handleServRes = (servRes: ServResUserLoginData) => {
    if (servRes.errMsg) {
      showToast(servRes.errMsg, "error");
    } else if (servRes.userData) {
      Cookies.set('uscTDLT', servRes.userData.accessToken);
      setUser({
        userId: servRes.userData.userId,
        userName: servRes.userData.userName,
        userEmail: servRes.userData.userEmail
      });
    }
  }

  // login function to login user
  // and to set the user data in the state
  const login = async (userCredentials: LoginCredentials) => {
    // check if the user credentials are provided or not
    // if not then return from the function
    if (!userCredentials) {
      console.error("User Credentials not provided as function parameter object.");
      return;
    }

    try {
      setUserLoading(true);
      const stringifiedCrd = JSON.stringify(userCredentials);

      const serverRes = await fetch(`${loginUrl}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: stringifiedCrd
      })

      const { userData, errMsg } = await serverRes.json();

      handleServRes({ userData, errMsg });
    } catch (err) {
      setUserLoading(false);
      handleErr(err);
    }
  };

  // register function to register user
  // and to set the user email verification data in the state
  const registerUser = async (registerCredentials: RegisterCredentials) => {
    let registerSucceeded = false;
    if (!registerCredentials) {
      console.error("Proper User Credentials are not provided as function parameter object.");
      return registerSucceeded;
    }

    if (registerCredentials.userPassword !== registerCredentials.userConfirmPassword) {
      console.error("Password and confirm password do not match.");
      return registerSucceeded;
    }

    const userPayload = {
      userName: registerCredentials.userName as string,
      userEmail: registerCredentials.userEmail as string,
      userPassword: registerCredentials.userPassword as string
    }
    
    try {
      const stringifiedCrd = JSON.stringify(userPayload);

      const serverRes = await fetch(`${registerUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: stringifiedCrd
      })

      const { succMsg, errMsg } = await serverRes.json();

      if (errMsg) {
        showToast(errMsg, "error");
      } else if (succMsg) {
        showToast(succMsg, "success");
        setNeedToVerifyEmail(true);
        registerSucceeded = true;
      }
    } catch (err) {
      handleErr(err);
    }
    
    return registerSucceeded;
  }

  // logout function to logout user
  // and to remove the user data from the state
  const logout = useCallback(async (userEmail: string) => {
    const userSecret: string | undefined = Cookies.get('uscTDLT');
    if (!userEmail || !userSecret) {
      console.error(!userEmail ? "User Email parameter value is required to logout an user." : "User must be logged in to get logged out.");
      return;
    }

    try {
      const serverRes = await fetch(`${logoutUrl}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userSecret}`
        },
        body: JSON.stringify({ userEmail })
      })

      const { succMsg, errMsg } = await serverRes.json();

      if (errMsg) {
        showToast(errMsg, "error");
      }
      else if (succMsg) {
        showToast(succMsg, "success");
        // remove the cookie and set the user to undefined
        Cookies.remove('uscTDLT');

        // set the user to undefined
        setUser(undefined);

        // reseting the refresh access token timeout loops by clearing the timeouts if available
        // and setting the timeout id array to empty array
        timeOutIdArr.forEach(clearTimeout);
        setTimeOutIdArr([]);
      }
    } catch (err) {
      handleErr(err);
    }
  }, [handleErr, timeOutIdArr]);

  // refresh token function to refresh the access token and store it in the cookies
  // success only true when the cookie is set successfully because on logout user needs to login again to get new refresh token
  const refreshTokenHandler = useCallback(async () => {
    if (!user) {
      console.error("User is not logged in to refresh the access token.");
      return false;
    }

    const { accessToken, errMsg, status } = await refreshAccessToken();
    let success = false;

    if (user?.userEmail && status === 401 && errMsg === "Invalid Refresh Token.") {
      // logout the user if the refresh token is invalid
      await logout(user?.userEmail);
    } else if (errMsg) {
      console.error(errMsg);
    } else if (accessToken) {
      Cookies.set('uscTDLT', accessToken);
      success = true;
    }

    return success;
  }, [user, logout]);

  const scheduleTokenRefreshLoop = useCallback(() => {
    let refreshTimeout: NodeJS.Timeout;

    const schedule = () => {
      const token = Cookies.get('uscTDLT');

      if (!token) {
        console.error("User is not logged in to schedule token refresh loop.");
        return;
      }

      const decoded = token ? decodeJwt(token) : undefined;
      const tokenExp = decoded?.exp ?? 0;
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = tokenExp - currentTime;

      if (timeUntilExpiry > 60) {
        refreshTimeout = setTimeout(() => {
          // looping the schedule by recursive calls after each time the refreshTokenHandler gets called before 1 minute of token expiry to avoid token expiry
          refreshTokenHandler().then(success => {
            if (success) {
              schedule();
            }
          });
        }, (timeUntilExpiry - 60) * 1000);
        setTimeOutIdArr(prev => [...prev, refreshTimeout]);
      } else {
        refreshTokenHandler().then(success => {
          if (success) {
            schedule();
          }
        });
      }
    };

    schedule();

    return () => {
      if (refreshTimeout !== undefined) {
        clearTimeout(refreshTimeout);
      }
    };
  }, [refreshTokenHandler]);


  // Schedule the token refresh loop when the component mounts
  // and clean up the interval when the component unmounts
  useEffect(() => {
    if (!isUserAvailable) {
      return;
    }

    const cleanup = scheduleTokenRefreshLoop();
    return cleanup;
  }, [isUserAvailable, scheduleTokenRefreshLoop]);


  // Check if the user is logged in or not
  // and set the user data in the state accordingly
  useEffect(() => {
    const userSecret = Cookies.get('uscTDLT');
    // check if the user is logged in but the user data is not available
    // then decode the jwt token and set the user data in the state
    if (!user && userSecret) {
      setUserLoading(true);
      const decoded = decodeJwt(userSecret);
      const userId = decoded?.userId as number | undefined;
      const userName = decoded?.userName as string | undefined;
      const userEmail = decoded?.userEmail as string | undefined;

      if (userId !== undefined && userName && userEmail) {
        setUser({
          userId,
          userName,
          userEmail
        });
      }
    } else if (user && userSecret) {
      setIsUserAvailable(true);
    } else {
      setIsUserAvailable(false);
    }
    setUserLoading(false);
  }, [user]);

  return (
    <AuthContext value={{ user, setUser, userLoading, setUserLoading, isUserAvailable, needToVerifyEmail, setIsUserAvailable, login, registerUser, logout, refreshTokenHandler, scheduleTokenRefreshLoop }}>{children}</AuthContext>
  )
}

export { AuthContext, AuthProvider };