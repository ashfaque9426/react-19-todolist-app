import Cookies from "js-cookie";
import { toast } from 'react-toastify';

// helper function to haddle success and error messages from the server
const handleSuccMsgErrMsgRes = async (res: Response, reqFromStr: string) => {
    let data;
    try {
        data = await res.json();

        if (!res.ok) {
            // This is where you handle HTTP error responses like 401, 400, etc.
            return { status: res.status, errMsg: data.errMsg };
        }

        return { status: res.status, ...data };
    } catch (jsonErr) {
        console.error("Failed to parse JSON", jsonErr);
        return { status: res.status, errMsg: `Invalid server response ${reqFromStr}.` };
    }
}

// for updating the password
export const updatePassword = async (previousState: unknown, formData: FormData) => {
    // Extracting form data
    if (previousState) {
        console.log(previousState);
    }

    // Check if formData is an instance of FormData
    if (!(formData instanceof FormData)) {
        console.error("FormData is not an instance of FormData.");
        return {
            succMsg: null,
            errMsg: null,
        };
    }

    // Extracting password and confirmPassword from formData
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Check if password and confirmPassword are not null or null
    if (!password || !confirmPassword) {
        return {
            succMsg: null,
            errMsg: "Please fill in all fields!",
        };
    } else if (password.length < 8 || confirmPassword.length < 8) {
        return {
            succMsg: null,
            errMsg: "Password must be at least 8 characters long.",
        };
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
        return {
            succMsg: null,
            errMsg: "Password and Confirm Password do not match.",
        };
    }

    try {
        // Get the token from cookies
        const token = Cookies.get('upPassSec');

        // Check if token is available
        if (!token) {
            return {
                succMsg: null,
                errMsg: "Token is missing. Please try again.",
            };
        }

        // Send the password update request to the server

        const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/api/update-password`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: token, newPassword: password, }),
        });

        return await handleSuccMsgErrMsgRes(response, "Update Password Request");

    } catch (error) {
        console.error(error);
    }
};

// for refresing the access token
export const refreshAccessToken = async () => {
    try {
        const res = await fetch(`${import.meta.env.REACT_APP_API_URL}/api/refresh-access-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        return await handleSuccMsgErrMsgRes(res, "Refresh Access Token Request");
    } catch (error) {
        console.error(error);
    }
};

// forgot password function to send the email from the server
export const forgotPassword = async (userEmail: string) => {
    if (!userEmail) {
        console.error("User email is required to send the forgot password request.");
        return;
    }

    try {
        const res = await fetch(`${import.meta.env.REACT_APP_API_URL}/api/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userEmail })
        });

        return await handleSuccMsgErrMsgRes(res, "Forgot Password Request");
    } catch (error) {
        console.error(error);
    }
}

// for getting the todo record by id
export const getTodoRecordById = async (todoId: string) => {
    const userSecret = Cookies.get('uscTDLT');
    if (!userSecret || !todoId) {
        return { errMsg: `${!userSecret ? "User must be logged in to get the todo record." : "Todo Id parameter value is required to get todo record from database."}` };
    }

    try {
        const res = await fetch(`${import.meta.env.REACT_APP_API_URL}/api/get-todo-record?recordId=${todoId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userSecret}`
            }
        });

        return await handleSuccMsgErrMsgRes(res, "Get Todo Record Request");
    } catch (error) {
        console.error(error);
    }
}

// get todo records for specific user
export const getTodoRecords = async (userId: number, date: string | undefined, title: string | undefined) => {
    const userSecret = Cookies.get('uscTDLT');
    if (!userSecret) {
        return { errMsg: "User must be logged in to get the todo record." };
    }

    let url = `${import.meta.env.REACT_APP_API_URL}/api/get-todo-records?userId=${userId}`;

    if (date) {
        url += `&date=${date}`;
    }

    if (title) {
        url += `&title=${title}`;
    }

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userSecret}`
            }
        });

        return await handleSuccMsgErrMsgRes(res, "Get Todo Records Requests for User");
    } catch (error) {
        console.error(error);
    }
}

// react-tostify function to show the toast message
export const showToast = (message: string, type: "success" | "error" | "info" | "warning") => {
    if (!message) {
        console.error("Message is required to show the toast message.");
        return;
    }
    if (!["success", "error", "info", "warning"].includes(type)) {
        console.error("Type is required to show the toast message.");
        return;
    }
    // Check if the toast library is available
    return toast[type](message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}