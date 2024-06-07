import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h2 className="text-2xl font-bold text-red-600">Not Found</h2>
      <p className="mt-3 text-lg text-gray-500">
        Could not find requested resource
      </p>
      <Link href="/" className="mt-6 text-blue-500 hover:underline">
        Return Home
      </Link>
    </div>
  );
}
