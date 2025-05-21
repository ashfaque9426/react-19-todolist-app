import { useFormStatus } from "react-dom";

function FormBtn() {
  const { pending } = useFormStatus();
  return (
    <button className="px-2.5 py-1 w-full rounded-lg bg-black hover:bg-gray-600 text-white text-lg font-semibold cursor-pointer my-1" type="submit" disabled={pending}>
      {
        pending ? "Submitting..." : "Submit"
      }
    </button>
  )
}

export default FormBtn;