import Cookies from "js-cookie";

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

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/update-password`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: token, newPassword: password, }),
        });

        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            const errorMessage = await response.text();
            return { succMsg: null, errMsg: errorMessage };
        }

        // Parse the response data and return it
        const data = await response.json();
        return data;

    } catch (error) {
        console.error(error);
    }
};