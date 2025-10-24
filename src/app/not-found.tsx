export default function NotFoundPage() {
  return (
    <div className="p-8 text-center min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        404 – Page could not be Found
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Sorry, that page doesn’t exist.
      </p>
      <a
        href="/"
        className="px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Go back home
      </a>
    </div>
  );
}
