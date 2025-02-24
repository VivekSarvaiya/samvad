
const ConfirmationModal = ({ text, onCancel = () => { }, onOk = () => { } }) => {
   return (
      <div className="p-4 rounded-lg bg-dark-secondary max-w-[220px] space-y-4">
         <p className="text-light-primary text-sm sm:text-[1rem]">{text}</p>
         <div className="flex justify-between items-center gap-2">
            <button
               className=" py-2 w-full bg-dark-secondary-200 text-light-primary font-semibold rounded-md"
               onClick={onCancel}
            >
               CANCEL
            </button>
            <button
               className="py-2 w-full bg-yellow-300 text-dark-secondary font-semibold rounded-md"
               onClick={onOk}
            >
               OK
            </button>
         </div>
      </div>
   )
};

export default ConfirmationModal;
