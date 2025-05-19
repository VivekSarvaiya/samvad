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
      .required('No password provided.'),
   // .min(3, 'Password is too short - should be 3 chars minimum.')
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
      // const toastId = toast.loading('Loading...');
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
      // toast.dismiss(toastId);
   }

   return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
         <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <div className="text-center mb-8">
               <h1 className="text-3xl font-bold text-indigo-600">Samvad</h1>
               <p className="text-gray-600 mt-2">Secure Chat Application</p>
            </div>
            <Formik
               initialValues={cred || initialValues}
               validationSchema={LoginSchema}
               onSubmit={onSubmitHandler}
            >
               {({ errors, touched }) => (

                  <Form>
                     <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                           Email
                        </label>
                        <Field className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                           id="email" name="email" type="email" placeholder="abc@gmail.com" />
                        {errors.email && touched.email ? (
                           <div className="text-red-500">{errors.email}</div>
                        ) : null}
                     </div>

                     <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                           Password
                        </label>
                        <Field className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                           id="password" name="password" type="password" placeholder="******" />
                        {errors.password && touched.password ? (
                           <div className="text-red-500">{errors.password}</div>
                        ) : null}
                     </div>

                     {/* <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                        <button className="bg-blue-500 hover:bg-blue-700 text-light-primary font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" disabled={loading}>
                           Sign In
                        </button>
                        <div className="mt-4">
                           <Link to="/signup" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 border-b border-blue-500 hover:border-blue-800">
                              Don't have an account?
                           </Link>
                        </div>
                     </div> */}
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                           <input
                              id="remember-me"
                              name="remember-me"
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                           />
                           <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                              Remember me
                           </label>
                        </div>

                        {/* <div className="text-sm">
                           <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                              Forgot password?
                           </a>
                        </div> */}
                     </div>

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
                           ) : "Sign In"}
                        </button>
                     </div>

                  </Form>
               )}

            </Formik>
            <div className="mt-6">
               <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                     <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                     <span className="px-2 bg-white text-gray-500">
                        New to Samvad?
                     </span>
                  </div>
               </div>

               <div className="mt-6">
                  <a
                     href="/signup"
                     className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                     Create an account
                  </a>
               </div>
            </div>
         </div>
      </div>
   )
};

export default Login;
