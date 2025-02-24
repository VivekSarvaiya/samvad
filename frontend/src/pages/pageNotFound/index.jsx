import { Result } from "antd";
import { Link } from "react-router-dom";

const PageNotFound = () => {
   return (
      <div className="w-screen h-screen flex justify-center items-center bg-dark-primary">
         <Result
            status="404"
            title={<p className="text-light-primary">404</p>}
            subTitle={<p className="text-light-primary">Sorry, the page you visited does not exist.</p>}
            extra={
               <Link to="/">
                  <button className="bg-blue-500 hover:bg-blue-700 text-light-primary font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                     Go to home
                  </button>
               </Link>
            }
         />
      </div>
   )
}

export default PageNotFound;
