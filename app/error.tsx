"use client"; // Error components must be Client Components

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-300">
      <div className="text-center space-y-6 max-w-lg z-10">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 mb-4 shadow-inner">
          <svg
            className="w-12 h-12 text-red-500 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">
          Something went wrong!
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          An unexpected error has occurred. We apologize for the inconvenience.
        </p>
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 bg-gradient-to-r from-red-500 to-red-600 rounded-full hover:scale-105 hover:shadow-lg shadow-red-500/30 dark:shadow-red-900/30"
          >
            Try again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-gray-700 dark:text-gray-300 transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm"
          >
            Return to Home
          </Link>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 dark:bg-red-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
    </div>
  );
}
