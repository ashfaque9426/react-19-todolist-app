// user data type after login
export type User = {
  userId: number,
  userEmail: string,
  userName: string
}

// login credentials type for login form data as function parameter
export type LoginCredentials = {
  userEmail: string,
  userPassword: string
}

// register credentials type for register form data as function parameter
export type RegisterCredentials = {
  userEmail: string,
  userName: string,
  userPassword: string,
  userConfirmPassword: string,
  recoveryStr: string
}

// Server response user login data type which should get returned from the server
export type ServResUserLoginData = {
  userData: {
    userId: number, userEmail: string, userName: string, accessToken: string
  },
  errMsg: string | undefined
}