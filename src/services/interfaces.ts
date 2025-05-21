import { LoginCredentials, RegisterCredentials, User } from "./dataTypes";

// Auth context data type interface for the AuthProvider component
// This context will be used to provide authentication data and functions to the entire app
type ScheduleTokenRefreshLoop = () => (() => void) | void;

type LoginResult = {
  success: string;
  error: string;
};

export interface AuthContextType {
  user: User | undefined,
  setUser: (user: User) => void,
  userLoading: boolean,
  setUserLoading: (state: boolean) => void,
  isUserAvailable: boolean,
  needToVerifyEmail: boolean,
  setIsUserAvailable: (state: boolean) => void,
  login: (loginCredentials: LoginCredentials) => Promise<LoginResult>,
  logout: (userEmail: string) => Promise<void>,
  registerUser: (registerCredentials: RegisterCredentials) => Promise<boolean>,
  refreshTokenHandler: () => Promise<boolean>,
  scheduleTokenRefreshLoop: ScheduleTokenRefreshLoop
}

// interface for error handler function
export interface ErrorHandler {
  (err: unknown): void;
}