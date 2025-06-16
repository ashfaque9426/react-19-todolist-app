import TodoForm from "../components/TodoForm";
import { FormState } from "../services/dataTypes";

function AddTodo() {
    const handleFormSubmission = async (
        _prevState: FormState,
        formData: FormData
    ): Promise<FormState> => {
        try {
            const date = formData.get('date') as string;
            const time = formData.get('time') as string;
            const title = formData.get('title') as string;
            const description = formData.get('description') as string;
            const status = 'not completed';

            // Example logic, replace with your backend call
            console.log({ date, time, title, description, status });

            return { success: 'Form submitted successfully!', error: '' };
        } catch (error) {
            return { success: '', error: `Add Todo Record Submission failed. Error: ${error}` };
        }
    };

    return (
        <>
            <h1 className="font-semibold text-2xl text-center my-12">Add Todo Record</h1>
            <TodoForm onSubmit={handleFormSubmission} />
        </>
    )
}

export default AddTodo;