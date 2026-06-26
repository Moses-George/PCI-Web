/* eslint-disable @typescript-eslint/no-unused-vars */

import { ClipLoader } from "react-spinners";

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
    <div className="flex justify-center items-center fixed h-full inset-0 bg-[#7180967A] backdrop-blur-[1.5px] z-[9999]">
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
            className="flex items-center gap-2 bg-red-600 py-2 px-6 text-sm shadow-md rounded-md text-white hover:opacity-75 transform active:scale-75 transition-transform cursor-pointer"
          >
            {loading && <ClipLoader color="white" size={18} />}
            <span className="">{loading ? "processing..." : "Continue"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeletion;
