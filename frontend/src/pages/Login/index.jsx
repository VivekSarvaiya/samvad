import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { onLogin } from "./services";
import { ACCESS_TOKEN, USER_DATA, setLocalStorageItem } from "../../utils/localStroageManager";

const LoginSchema = Yup.object().shape({
   email: Yup.string().email('Invalid email').required('Required'),
   password: Yup.string()
      .required('No password provided.')
      .min(3, 'Password is too short - should be 3 chars minimum.')
   // .matches(/[0-9]/, 'Password requires a number')
   // .matches(/[a-z]/, 'Password requires a lowercase letter')
   // .matches(/[A-Z]/, 'Password requires an uppercase letter')
   // .matches(/[^\w]/, 'Password requires a symbol'),
});

const Login = () => {

   const location = useLocation();
   const cred = location?.state;

   const initialValues = {
      email: '',
      password: '',
   }

   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   const onSubmitHandler = async (values) => {
      const toastId = toast.loading('Loading...');
      setLoading(true)

      const response = await onLogin(values);

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
         <Formik
            initialValues={cred || initialValues}
            validationSchema={LoginSchema}
            onSubmit={onSubmitHandler}
         >
            {({ errors, touched }) => (

               <Form
                  className="w-full sm:w-[500px] max-w-[500px] border border-[#374151] bg-dark-secondary shadow-lg shadow-gray-500/40 rounded px-8 pt-6 pb-8 mb-4"
               >
                  <h3 className="mb-4 sm:mb-0 text-center text-xl text-light-primary font-semibold">Login</h3>

                  <div className="mb-4">
                     <label className="block text-light-primary text-sm font-bold mb-2" htmlFor="email">
                        Email
                     </label>
                     <Field className="shadow appearance-none border border-[#374151] rounded w-full py-2 px-3 text-light-primary bg-[#374151] leading-tight focus:outline-none focus:shadow-outline" id="email" name="email" type="email" placeholder="abc@gmail.com" />
                     {errors.email && touched.email ? (
                        <div className="text-red-500">{errors.email}</div>
                     ) : null}
                  </div>

                  <div className="mb-6">
                     <label className="block text-light-primary text-sm font-bold mb-2" htmlFor="password">
                        Password
                     </label>
                     <Field className="shadow appearance-none border border-[#374151] rounded w-full py-2 px-3 text-light-primary bg-[#374151] leading-tight focus:outline-none focus:shadow-outline" id="password" name="password" type="password" placeholder="******" />
                     {errors.password && touched.password ? (
                        <div className="text-red-500">{errors.password}</div>
                     ) : null}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                     <button className="bg-blue-500 hover:bg-blue-700 text-light-primary font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" disabled={loading}>
                        Sign In
                     </button>
                     {/* <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                        Forgot Password?
                     </a> */}

                     <div className="mt-4">
                        <Link to="/signup" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 border-b border-blue-500 hover:border-blue-800">
                           Don't have an account?
                        </Link>
                     </div>
                  </div>

                  <Link to="/test-credentials" className="mt-4 inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 border-b border-blue-500 hover:border-blue-800">
                     Test credentials
                  </Link>
               </Form>
            )}

         </Formik>
      </div>
   )
};

export default Login;
