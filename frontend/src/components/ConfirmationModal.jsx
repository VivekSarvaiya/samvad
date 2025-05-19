
const ConfirmationModal = ({ text, onCancel = () => { }, onOk = () => { } }) => {
   return (
      <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 max-w-[220px] space-y-4">
         <p className="text-light-primary text-sm sm:text-[1rem]">{text}</p>
         <div className="flex justify-between items-center gap-2">
            <button
               className=" py-2 w-full bg-dark-secondary-200 text-light-primary font-semibold rounded-md"
               onClick={onCancel}
            >
               CANCEL
            </button>
            <button
               className="py-2 w-full bg-indigo-600 dark:text-white text-dark-secondary font-semibold rounded-md"
               onClick={onOk}
            >
               OK
            </button>
         </div>
      </div>
   )
};

export default ConfirmationModal;
