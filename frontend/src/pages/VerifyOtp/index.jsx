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
      background: "#374151",
      borderRadius: "3px",
      border: "none",
      fontSize: "20px",
      margin: "16px 18px 20px 18px",
      outline: "none",
      color: "white",
   };

   const countDownTimer = 30;

   const [otp, setOtp] = useState('');
   const [loading, setLoading] = useState(false);
   const [counter, setCounter] = useState(countDownTimer);
   const [resendOtpDisabled, setResendOtpDisabled] = useState(false);

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
      <div className="transition-none w-screen h-screen p-4 flex justify-center items-center bg-dark-primary">
         <form className="w-full sm:w-[400px] max-w-[500px] border border-[#374151] bg-dark-secondary shadow-lg shadow-gray-500/40 rounded px-8 pt-6 pb-8 mb-4" onSubmit={onSubmitHandler}>
            <h3 className="mb-4 sm:mb-0 text-center text-xl text-light-primary font-semibold">Verify-OTP</h3>
            <div className="flex justify-center items-center">
               <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={4}
                  inputStyle={inputstyle}
                  renderSeparator={<span className="text-light-primary">-</span>}
                  renderInput={(props) => <input {...props} />}
                  shouldAutoFocus={true}
               />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
               <button className="bg-blue-500 hover:bg-blue-700 text-light-primary font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-dark-secondary-200" type="submit" disabled={loading || otp.length < 4}>
                  Verify
               </button>
               <p
                  className={`inline-block align-baseline font-bold text-sm ${!resendOtpDisabled ? "text-blue-500 hover:text-blue-800 cursor-pointer" : "text-dark-secondary-300"}`}
                  onClick={resendOtpHandler}
               >
                  Resend OTP?
               </p>
            </div>

            {
               resendOtpDisabled && counter > 0 &&
               <p className="mt-2 text-center text-blue-500 font-bold">{counter}s</p>
            }
         </form>
      </div>
   )
};

export default VerifyOtp;
