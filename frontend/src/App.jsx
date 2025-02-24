import { Route, Routes } from "react-router-dom";
import PublicRoute from "./routeGuard/PublicRoute";
import PrivateRoute from "./routeGuard/PrivateRoute";
import Chat from "./pages/Chat";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PageNotFound from "./pages/pageNotFound";
import VerifyOtp from "./pages/VerifyOtp";
import { Toaster } from 'react-hot-toast';
import TestCredentials from "./pages/TestCredentials";

const App = () => {
  return (
    <>
      <Toaster />
      <Routes>

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/test-credentials" element={<TestCredentials />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Chat />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />

      </Routes>
    </>
  )
};

export default App;
