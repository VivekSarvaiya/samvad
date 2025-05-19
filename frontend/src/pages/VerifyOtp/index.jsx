import { useState } from "react";
import toast from "react-hot-toast";
import OtpInput from "react-otp-input";
import { useLocation, useNavigate } from "react-router-dom";
import { onVerifyOtp } from "./services";
import { ACCESS_TOKEN, USER_DATA, setLocalStorageItem } from "../../utils/localStroageManager";
import { onSendOtp } from "../Signup/services";

const VerifyOtp = () => {

   const inputstyle = {
      width: "40px",
      height: "56px",
      // background: "#374151",
      borderRadius: "3px",
      border: "2px solid #4f46e5",
      fontSize: "20px",
      margin: "16px 18px 20px 18px",
      // outline: "none",
      // color: "white",
   };

   const countDownTimer = 30;

   const [otp, setOtp] = useState('');
   const [loading, setLoading] = useState(false);
   const [counter, setCounter] = useState(countDownTimer);
   const [resendOtpDisabled, setResendOtpDisabled] = useState(false);
   const [error, setError] = useState("");
   const navigate = useNavigate();
   const location = useLocation();
   const signUpFormValues = location?.state;

   const resendOtpHandler = async () => {
      if (resendOtpDisabled) return;

      const toastId = toast.loading('Loading...');
      setLoading(true)

      const body = {
         email: signUpFormValues.email
      }

      const response = await onSendOtp(body);

      if (response.success) {
         setResendOtpDisabled(true);
         const interval = setInterval(() => {
            setCounter((prev) => prev - 1);
         }, 1000)
         setTimeout(() => {
            setResendOtpDisabled(false);
            clearInterval(interval);
            setCounter(countDownTimer);
         }, countDownTimer * 1000)
      }
      else {
         toast.error(response.message);
      }

      setLoading(false)
      toast.dismiss(toastId);
   }

   const onSubmitHandler = async (e) => {
      e.preventDefault();
      if (!otp) {
         setError("Please enter OTP");
         return;
      }

      const toastId = toast.loading('Loading...');
      setLoading(true)

      const body = {
         otp,
         email: signUpFormValues.email,
         username: signUpFormValues.username,
         password: signUpFormValues.password,
      }

      const response = await onVerifyOtp(body);

      if (response.success) {
         setLocalStorageItem(ACCESS_TOKEN, response.data.data.accessToken)
         setLocalStorageItem(USER_DATA, response.data.data.user)
         navigate("/")
      }
      else {
         toast.error(response.message);
      }

      setLoading(false)
      toast.dismiss(toastId);
   }

   return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
         <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <div className="text-center mb-8">
               <h1 className="text-3xl font-bold ">Verify OTP</h1>
               {/* <p className="text-gray-600 mt-2">Secure Chat Application</p> */}
            </div>
            <form onSubmit={onSubmitHandler}>
               <h3 className="mb-4 sm:mb-0 text-center text-xl text-light-primary font-semibold">Verify-OTP</h3>
               <div className="flex justify-center items-center">
                  <OtpInput
                     value={otp}
                     onChange={setOtp}
                     numInputs={4}
                     inputStyle={inputstyle}
                     renderSeparator={<span className="">-</span>}
                     renderInput={(props) => <input {...props} />}
                     shouldAutoFocus={true}
                  />
               </div>
               {error && (
                  <div className="mb-4 text-center text-red-500">{error}</div>
               )}
               {/* <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                  <button className="bg-blue-500 hover:bg-blue-700 text-light-primary font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-dark-secondary-200" type="submit" disabled={loading || otp.length < 4}>
                     Verify
                  </button>
                  <p
                     className={`inline-block align-baseline font-bold text-sm ${!resendOtpDisabled ? "text-blue-500 hover:text-blue-800 cursor-pointer" : "text-dark-secondary-300"}`}
                     onClick={resendOtpHandler}
                  >
                     Resend OTP?
                  </p>
               </div> */}

               <div>
                  <button
                     type="submit"
                     disabled={loading}
                     className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                     {loading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                     ) : "Verify OTP"}
                  </button>
               </div>

               {
                  resendOtpDisabled && counter > 0 &&
                  <p className="mt-2 text-center text-blue-500 font-bold">{counter}s</p>
               }
            </form>
            <div className="mt-6">
               <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                     <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                     <span className="px-2 bg-white text-gray-500">
                        Didn't receive the code?
                     </span>
                  </div>
               </div>

               <div className="mt-6">
                  <div
                     className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                     onClick={resendOtpHandler}
                  >
                     Resend OTP
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
};

export default VerifyOtp;
