"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const goToTodos = () => {
    router.push("/todos");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-blue-100 via-white to-purple-100 px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-4 max-w-lg w-full">
          Hi I’m Omotoyosi, Welcome to My To-do App
        </h1>
        <p className="text-gray-600 mb-3">
          Tackle your day, one to-do at a time.
        </p>
        <p className="text-gray-600 mb-6">One step closer to done.</p>
        <button
          onClick={goToTodos}
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition cursor-pointer"
        >
          Go to Todos
        </button>
      </div>
    </div>
  );
}
