import { isRejectedWithValue, Middleware } from "@reduxjs/toolkit";
import { toast } from "sonner";

interface ApiError {
  status: number;
  data?: {
    message?: string;
  };
}

export const errorMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const error = action.payload as ApiError;

    // Don't show notification for 401 (handled by auth)
    if (error.status === 401) {
      return next(action);
    }

    let message = "An unexpected error occurred";

    if (error.data?.message) {
      message = error.data.message;
    } else if (error.status === 403) {
      message = "You do not have permission to perform this action";
    } else if (error.status === 404) {
      message = "Resource not found";
    } else if (error.status === 422) {
      message = "Validation error";
    } else if (error.status === 500) {
      message = "Server error. Please try again later.";
    }

    toast.error(message);
  }

  return next(action);
};
