import { useNavigate } from "react-router-dom";
import errorImage from "../assets/images/icon-error.svg"
import Header from "./header"

const Error = () => {
  const navigate = useNavigate();
  const returnHome = () => {
    navigate("/");
  }
  return (
    <>
    <Header />
    <div className='flex flex-col text-center items-center mt-35'>
    <img src={errorImage} alt="logo" className="w-10 mb-8"/>
        <h1 className='text-5xl font-bold'>Something went wrong</h1>
        <p className='mt-10 text-lg'>We couldn't connect to the server(API error). Please try again in a few moments.</p>
        <button 
        className='bg-neutral-600 p-2 rounded-lg mt-5 cursor-pointer'
        onClick={returnHome}
        >
        Retry
        </button>
    </div>
    </>
  )
}

export default Error