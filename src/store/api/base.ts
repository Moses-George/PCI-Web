/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/store/store";
import { logout } from "../slices/authSlice";
import { VITE_ENDPOINT_URL } from "@/lib/variables";

export const baseQueryWithAuth = async (
  args: any,
  api: any,
  extraOptions: any,
) => {
  const result = await fetchBaseQuery({
    baseUrl: `${VITE_ENDPOINT_URL}/api`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  })(args, api, extraOptions);

  // Auto logout if token expired
  if (result.error?.status === 401) {
    api.dispatch(logout());
  }

  return result;
};
