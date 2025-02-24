import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const Loader = ({ className = "", fullscreen = false, iconSize = 24 }) => {
   return (
      <div className={`w-full h-full flex justify-center items-center ${className}`}>
         <Spin
            fullscreen={fullscreen}
            indicator={
               <LoadingOutlined
                  style={{
                     fontSize: iconSize,
                  }}
                  spin
               />
            }
         />
      </div>
   )
};

export default Loader;
