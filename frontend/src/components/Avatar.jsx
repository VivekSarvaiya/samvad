import React from "react";

const Avatar = ({ src = "", alt = "profile-icon", className = "" }) => {
   return (
      <img
         className={`w-[40px] object-cover rounded-full border border-light-secondary dark:border-dark-primary ${className}`}
         src={src}
         alt={alt}
      />
   )
};

export default Avatar;
