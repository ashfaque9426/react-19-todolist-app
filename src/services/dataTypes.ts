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
  userConfirmPassword: string
}

// Server response user login data type which should get returned from the server
export type ServResUserLoginData = {
  userData: {
    userId: number, userEmail: string, userName: string, accessToken: string
  },
  errMsg: string | undefined
}

// form states
export type FormState = {
  success: string;
  error: string;
};

// record data type
export type RecordData = {
  id: number;
  todo_date: string;
  todo_title: string;
  todo_description: string;
  todo_time: string;
  todo_status: string;
  user_id: number;
};