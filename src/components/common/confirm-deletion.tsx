/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IConfirmationProps {
  confirmAction: any;
  closeModal: any;
  loading: boolean;
  header: string;
  message: string;
}

const ConfirmDeletion = ({
  confirmAction,
  closeModal,
  loading,
  header,
  message,
}: IConfirmationProps) => {
  // const
  return (
    <div className="flex justify-center items-center fixed inset-0 bg-[rgb(0,0,0,0.8)] bg-opacity-50 z-[9999]">
      <div className="bg-white px-4 py-6 rounded shadow-md md:w-[500px] z-[9999] space-y-10">
        <div className="space-y-2">
          <h1 className="lg:text-xxl text-lg text-gray-800 font-semibold">
            {header}
          </h1>
          <p className="text-sm text-slate-500">{message}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={closeModal}
            className="text-sm bg-slate-800 py-2 px-6 shadow-md rounded-md text-white hover:opacity-75 transform active:scale-75 transition-transform cursor-pointer"
          >
            cancel
          </button>
          <button
            onClick={confirmAction}
            className="bg-red-600 py-2 px-6 text-sm shadow-md rounded-md text-white hover:opacity-75 transform active:scale-75 transition-transform cursor-pointer"
            // bgColorClass="bg-blue-400"
            // isLoading={loading}
            // loadingMsg="processing..."
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeletion;
