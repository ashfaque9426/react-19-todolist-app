import { useState, ReactNode, useEffect, createContext } from "react";
import Cookies from 'js-cookie';

export type User = {
  userId: number,
  userEmail: string,
  userName: string
}

interface AuthContextType {
  user: User | undefined,
  setUser: (user: User) => void,
  userLoading: boolean,
  setUserLoading: (state: boolean) => void,
  isUserAvailable: boolean,
  setIsUserAvailable: (state: boolean) => void,
  logout: () => Promise<void>,
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [userLoading, setUserLoading] = useState(true);
  const [isUserAvailable, setIsUserAvailable] = useState(false);

  const logout = async () => {}

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
    <AuthContext value={{user, setUser, userLoading, setUserLoading, isUserAvailable, setIsUserAvailable, logout}}>{children}</AuthContext>
  )
}

export { AuthContext, AuthProvider };