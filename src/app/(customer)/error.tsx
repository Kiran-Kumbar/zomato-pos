"use client";

import { useEffect } from "react";

export default function CustomerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Caught by customer error boundary:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl max-w-md w-full shadow-sm border border-red-100">
        <h2 className="text-xl font-bold mb-2">Something went wrong!</h2>
        <p className="text-sm opacity-80 mb-4">{error.message}</p>
        <button
          onClick={() => reset()}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-medium transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
