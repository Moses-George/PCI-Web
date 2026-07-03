/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from "@reduxjs/toolkit/query/react";
import type { TokenResponse, LoginRequest } from "@/types/auth";
import { baseQueryWithAuth } from "./base";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["auth"],
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query(payload) {
        return {
          url: "/auth/create",
          method: "POST",
          // credentials: "include",
          body: payload,
        };
      },
      invalidatesTags: ["auth"],
    }),
    authorizeUser: builder.mutation<TokenResponse, LoginRequest>({
      query(payload) {
        return {
          url: "/auth",
          method: "POST",
          // credentials: "include",
          body: payload,
        };
      },
      invalidatesTags: ["auth"],
    }),
  }),
});

export const { useCreateUserMutation, useAuthorizeUserMutation } = authApi;
