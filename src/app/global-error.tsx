"use client";

import { AppButton } from "@/components/ui/app-button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <h1 className="text-9xl font-black text-gray-200 dark:text-gray-800">
            500
          </h1>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Critical Error
          </h2>
          <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-400">
            A critical error occurred. Please try again later.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <AppButton onClick={() => reset()} variant="contained">
              Try again
            </AppButton>
          </div>
        </div>
      </body>
    </html>
  );
}
