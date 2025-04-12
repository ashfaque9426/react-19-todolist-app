import { useState, ReactNode, useEffect, createContext } from "react";
import Cookies from 'js-cookie';

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

interface AuthContextType {
  user: User | undefined,
  setUser: (user: User) => void,
  userLoading: boolean,
  setUserLoading: (state: boolean) => void,
  isUserAvailable: boolean,
  setIsUserAvailable: (state: boolean) => void,
  login: (loginCredentials: LoginCredentials) => Promise<void>,
  logout: () => Promise<void>,
  registerUser: (registerCredentials: RegisterCredentials) => Promise<void>,
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [userLoading, setUserLoading] = useState(true);
  const [isUserAvailable, setIsUserAvailable] = useState(false);

  const login = async (userCredentials: LoginCredentials) => {
    console.log(userCredentials)
  }

  const registerUser = async (userCredentials: RegisterCredentials) => {
    console.log(userCredentials);
  }

  const logout = async () => {
    const userSecret = Cookies.get('uscTDLT');
    if (userSecret) {
      Cookies.remove('uscTDLT');
      setUser(undefined);
      setIsUserAvailable(false);
    }
  }

  useEffect(() => {
    const userSecret = Cookies.get('uscTDLT');
    if (user && userSecret) {
      setIsUserAvailable(true);
    } else {
      setIsUserAvailable(false);
    }
    setUserLoading(false);
  }, [user]);

  return (
    <AuthContext value={{user, setUser, userLoading, setUserLoading, isUserAvailable, setIsUserAvailable, login, registerUser, logout}}>{children}</AuthContext>
  )
}

export { AuthContext, AuthProvider };