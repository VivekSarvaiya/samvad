import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { onSendOtp } from "./services";

const SignupSchema = Yup.object().shape({
   email: Yup.string().email('Invalid email').required('Required'),
   username: Yup.string()
      .min(2, 'Too Short! - should be 2 chars minimum')
      .max(50, 'Too Long! - should be 50 chars maximum')
      .required('Required'),
   password: Yup.string()
      .required('No password provided.')
      .min(3, 'Password is too short - should be 3 chars minimum.'),
   // .matches(/[0-9]/, 'Password requires a number')
   // .matches(/[a-z]/, 'Password requires a lowercase letter')
   // .matches(/[A-Z]/, 'Password requires an uppercase letter')
   // .matches(/[^\w]/, 'Password requires a symbol'),
   confirmpassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Must match "password" field value'),
});

const Signup = () => {


   const initialValues = {
      email: '',
      username: '',
      password: '',
      confirmpassword: '',
   }

   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   const onSubmitHandler = async (values) => {

      const toastId = toast.loading('Loading...');
      setLoading(true)

      const body = {
         email: values.email
      }

      const response = await onSendOtp(body);

      if (response.success) {
         navigate("/verify-otp", {
            state: values
         })
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
            initialValues={initialValues}
            validationSchema={SignupSchema}
            onSubmit={onSubmitHandler}
         >

            {({ errors, touched }) => (

               <Form className="w-full sm:w-[500px] max-w-[500px] border border-[#374151] bg-dark-secondary shadow-lg shadow-gray-500/40 rounded px-8 pt-6 pb-8 mb-4">
                  <h3 className="mb-4 sm:mb-0 text-center text-xl text-light-primary font-semibold">Sign Up</h3>
                  <div className="mb-4">
                     <label className="block text-light-primary text-sm font-bold mb-2" htmlFor="email">
                        Email
                     </label>
                     <Field className="shadow appearance-none border border-[#374151] rounded w-full py-2 px-3 text-light-primary bg-[#374151] leading-tight focus:outline-none focus:shadow-outline" id="email" name="email" type="email" placeholder="abc@gmail.com" />
                     {errors.email && touched.email ? (
                        <div className="text-red-500">{errors.email}</div>
                     ) : null}
                  </div>
                  <div className="mb-4">
                     <label className="block text-light-primary text-sm font-bold mb-2" htmlFor="username">
                        Username
                     </label>
                     <Field className="shadow appearance-none border border-[#374151] rounded w-full py-2 px-3 text-light-primary bg-[#374151] leading-tight focus:outline-none focus:shadow-outline" id="username" name="username" type="text" placeholder="Username" />
                     {errors.username && touched.username ? (
                        <div className="text-red-500">{errors.username}</div>
                     ) : null}
                  </div>
                  <div className="mb-4">
                     <label className="block text-light-primary text-sm font-bold mb-2" htmlFor="password">
                        Password
                     </label>
                     <Field className="shadow appearance-none border border-[#374151] rounded w-full py-2 px-3 text-light-primary bg-[#374151] leading-tight focus:outline-none focus:shadow-outline" id="password" name="password" type="password" placeholder="******" />
                     {errors.password && touched.password ? (
                        <div className="text-red-500">{errors.password}</div>
                     ) : null}
                  </div>
                  <div className="mb-6">
                     <label className="block text-light-primary text-sm font-bold mb-2" htmlFor="confirmpassword">
                        Confirm Password
                     </label>
                     <Field className="shadow appearance-none border border-[#374151] rounded w-full py-2 px-3 text-light-primary bg-[#374151] leading-tight focus:outline-none focus:shadow-outline" id="confirmpassword" name="confirmpassword" type="password" placeholder="******" />
                     {errors.confirmpassword && touched.confirmpassword ? (
                        <div className="text-red-500">{errors.confirmpassword}</div>
                     ) : null}
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                     <button className="bg-blue-500 hover:bg-blue-700 text-light-primary font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" disabled={loading}>
                        Resgister
                     </button>
                     <Link to="/login" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                        Already resgistered ?
                     </Link>
                  </div>

                  <Link to="/test-credentials" className="mt-4 inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 border-b border-blue-500 hover:border-blue-800">
                     Test credentials
                  </Link>
               </Form>
            )}

         </Formik>



      </div>
   )
}

export default Signup;
