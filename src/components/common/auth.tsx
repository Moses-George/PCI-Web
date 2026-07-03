/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useAuthorizeUserMutation } from "@/store/api/auth";
import { setCredentials } from "@/store/slices/authSlice";
import { normalizeError } from "@/utils/helpers";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

interface IAuthForm {
  email: string;
  password: string;
}

const Auth = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<IAuthForm>({
    defaultValues: { email: "", password: "" },
  });

  const [authorizeUser, { isLoading }] = useAuthorizeUserMutation();

  const onSubmit = async (data: IAuthForm) => {
    try {
      const result = await authorizeUser(data).unwrap();
      dispatch(
        setCredentials({ token: result.access_token, user: result.user }),
      );
      reset();
    } catch (error) {
      const normalized = normalizeError(error);
      // Show a toast with the main error message
      toast.error(normalized.message);
      // If there are field‑specific errors, set them in React Hook Form
      if (
        normalized.fieldErrors &&
        Object.keys(normalized.fieldErrors).length > 0
      ) {
        for (const [field, message] of Object.entries(normalized.fieldErrors)) {
          setError(field as any, { type: "server", message });
        }
      }
    }
  };

  return (
    <div className="flex justify-center items-center fixed h-full inset-0 bg-[#7180967A] backdrop-blur-[1.5px] z-[9999]">
      <div className="bg-white px-8 py-6 rounded shadow-md md:w-[500px] z-[9999] space-y-6">
        <div className="space-y-2">
          <h1 className="lg:text-xl text-lg text-gray-800 font-semibold">
            System User Authorization is Reuired
          </h1>
          <p className="text-sm text-slate-500">
            Please enter user email and pass to continue
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm font-medium font-jakarta text-gray-700">
              Email
            </label>
            <input
              {...register("email", { required: "email is required" })}
              type="email"
              className="mt-1 w-full font-jakarta px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 font-jakarta text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium font-jakarta text-gray-700">
              Password
            </label>
            <input
              {...register("password", { required: "password is required" })}
              type="password"
              className="mt-1 w-full font-jakarta px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 font-jakarta text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="flex gap-4">
            {/* <button
              // onClick={closeModal}
              className="text-sm bg-slate-800 py-2 px-6 shadow-md rounded-md text-white hover:opacity-75 transform active:scale-75 transition-transform cursor-pointer"
            >
              cancel
            </button> */}
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 py-2.5 px-6 text-sm shadow-md rounded-md text-white hover:opacity-75 transform active:scale-75 transition-transform cursor-pointer"
            >
              {isLoading && <ClipLoader color="white" size={18} />}
              <span className="">
                {isLoading ? "Authorizing..." : "Continue"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
