import { logoutUser, loginUser } from "@/features/auth/slices/authSlice";
import { APP_CONFIG } from "@/lib/constants/config";
import type { ApiResponse } from "@/types";
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";
import { deleteCookie } from "cookies-next";

// Create a new mutex
const mutex = new Mutex();

const rawBaseQuery = fetchBaseQuery({
  baseUrl: APP_CONFIG.apiUrl,
  // Ensure cookies are sent/received with requests
  prepareHeaders: (headers, { getState }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = getState() as any; // Cast to avoid circular dependency import with RootState
    const token = state.auth.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

/**
 * Base query that automatically unwraps the API response envelope
 */
const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    return result;
  }

  // Unwrap successful response
  const apiResponse = result.data as ApiResponse<unknown> | undefined;
  if (
    apiResponse &&
    typeof apiResponse === "object" &&
    "success" in apiResponse &&
    "data" in apiResponse
  ) {
    return {
      ...result,
      data: apiResponse.data,
    };
  }

  return result;
};

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  const url = typeof args === "string" ? args : args.url;
  const PUBLIC_AUTH_ROUTES = [
    "/auth/login",
    "/auth/register",
    "/auth/refresh-token",
    "/auth/logout",
  ];

  const isProtectedRoute = (url: string) =>
    !!url && !PUBLIC_AUTH_ROUTES.some((route) => url.includes(route));

  if (result.error && result.error.status === 401 && isProtectedRoute(url)) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        // Try to refresh the token using HttpOnly cookie
        const refreshResult = await rawBaseQuery(
          {
            url: "/auth/refresh-token",
            method: "POST",
            credentials: "include",
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          // Unwrap response manually since rawBaseQuery doesn't
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = refreshResult.data as any; // ApiResponse wrapper
          // The API returns AuthResponse inside data.data if standardized
          const authResponse = data.data ? data.data : data;

          if (authResponse?.accessToken) {
            api.dispatch(
              loginUser({
                user: authResponse.user,
                token: authResponse.accessToken,
              })
            );
            // Retry the initial query
            result = await baseQuery(args, api, extraOptions);
          } else {
            deleteCookie("accessToken");
            api.dispatch(logoutUser());
            window.location.href = "/login";
          }
        } else {
          deleteCookie("accessToken");
          api.dispatch(logoutUser());
          window.location.href = "/login";
        }
      } finally {
        release();
      }
    } else {
      // WaitForUnlock was called at start, so if we are here it means mutex was locked
      // and released by another thread which hopefully refreshed the token.
      // So checking wait again effectively ensures we wait for that other thread.
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};
