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
  fetchNotifications: boolean,
  setIsUserAvailable: (state: boolean) => void,
  setFetchNotifications: (state: boolean) => void,
  login: (loginCredentials: LoginCredentials) => Promise<LoginResult>,
  logout: (userEmail: string) => Promise<void>,
  registerUser: (registerCredentials: RegisterCredentials) => Promise<boolean>,
  refreshTokenHandler: () => Promise<boolean>,
  scheduleTokenRefreshLoop: ScheduleTokenRefreshLoop,
  renderComp: string,
  setRenderComp: (state: 'render ShowDataCards comp' | 'render ShowDataLists comp' | '') => void,
  titleFromEdit: string,
  setTitleFromEdit: (state: string) => void,
  timeFromEdit: string,
  setTimeFromEdit: (state: string) => void,
  fetchDates: boolean,
  setFetchDates: (state: boolean) => void,
  navHeight: number,
  setNavHeight: (height: number) => void,
  footerHeight: number,
  setFooterHeight: (height: number) => void,
  elemCount: number,
  setElemCount: (count: number) => void,
  compHeight: string,
  setCompHeight: (heightVal: string) => void,
  recordStatus: string,
  setRecordStatus: (status: string) => void,
}

// interface for error handler function
export interface ErrorHandler {
  (err: unknown): void;
}