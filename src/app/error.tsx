"use client"; // Error components must be Client Components

import { useEffect } from "react";

export default function ErrorPage({
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
    <section className="bg-slate-100 flex justify-center items-center h-screen">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-yellow-500 ">
            500
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-700 md:text-4xl ">
            Something went wrong.
          </p>
          <p className="mb-4 text-lg font-light  text-gray-500">
            There was an unexpected error and something went wrong.
          </p>
          <button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
            className="inline-flex text-white bg-yellow-500 hover:bg-yellow-600 transition-all duration-300 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4"
          >
            Try again
          </button>
        </div>
      </div>
    </section>
  );
}
