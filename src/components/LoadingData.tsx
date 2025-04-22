import { AiOutlineLoading3Quarters } from "react-icons/ai";

function LoadingData() {
  return (
    <div className='absolute top-0 right-0 left-0 bottom-0 bg-black opacity-35 z-50 flex justify-center items-center text-4xl text-yellow-500'><AiOutlineLoading3Quarters /></div>
  )
}

export default LoadingData;