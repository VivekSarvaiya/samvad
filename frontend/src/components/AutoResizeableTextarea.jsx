import { useEffect, useRef } from "react";

const AutoResizeableTextarea = ({
   className = "",
   value,
   placeholder = "",
   maxHeight = 200,
   onChange = () => { },
   onKeyDown = () => { },
   ...rest
}) => {

   const textareaRef = useRef(null);

   useEffect(() => {
      if (!value) {
         textareaRef.current.focus();
      }
      textareaRef.current.style.height = "auto"; // Reset height to auto to recalculate scrollHeight
      const scrollHeight = textareaRef.current.scrollHeight;
      if (scrollHeight > maxHeight) {
         textareaRef.current.style.height = maxHeight + "px";
         textareaRef.current.style.overflowY = "auto"; // Show scrollbar
      } else {
         textareaRef.current.style.height = scrollHeight + "px";
         textareaRef.current.style.overflowY = "hidden"; // Hide scrollbar
      }
   }, [value]);

   return (
      <textarea
         className={`${className} w-full border-none outline-none resize-none overflow-hidden`}
         placeholder={placeholder}
         ref={textareaRef}
         rows={1}
         value={value}
         onChange={onChange}
         onKeyDown={onKeyDown}
         {...rest}
      />
   )
};

export default AutoResizeableTextarea;
