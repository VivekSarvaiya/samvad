import { Navigate, Outlet } from "react-router-dom";
import { ACCESS_TOKEN, getLocalStorageItem } from "../utils/localStroageManager";

const PublicRoute = () => {
   const token = getLocalStorageItem(ACCESS_TOKEN);

   return !token ? <Outlet /> : <Navigate to="/" />;
};

export default PublicRoute;
