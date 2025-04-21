import { useState } from "react";

function UpdatePasswordForm({ token }: { token: string }) {
    // State variables to manage form visibility and messages
    const [showForm, setShowForm] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // This component handles the password update form submission
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch('/api/update-password', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: token, newPassword: password, }),
            });

            if (!response.ok) {
                setErrorMsg("Failed to update password. Please try again.");
            }

            setSuccessMsg("Password updated successfully!");
            setShowForm(false);
        } catch (error) {
            console.error(error);
            setErrorMsg("Error updating password. Please try again.");
        }
    };

    return (
        <>
            {
                showForm ? (
                    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 my-5" method="POST" onSubmit={handleSubmit}>
                        <legend className="font-bold my-3">Please Update your password here.</legend>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                                New Password:
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                                Confirm Password:
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Update Password
                        </button>
                    </form>
                ) : (
                    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 my-5">
                        <h2 className="text-2xl font-bold my-5">Password Update Status</h2>
                        {successMsg && <p className="text-green-500">{successMsg}</p>}
                        {errorMsg && <p className="text-red-500">{errorMsg}</p>}
                    </div>
                )
            }
        </>
    )
}

export default UpdatePasswordForm