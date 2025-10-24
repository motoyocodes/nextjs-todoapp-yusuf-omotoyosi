"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchTodoById } from "@/lib/todoApi";
import type { Todo } from "@/lib/types";

interface TodoPageProps {
  params: Promise<{ id: string }>;
}

export default function TodoPage({ params }: TodoPageProps) {
  const { id } = use(params); // ✅ Unwrap params Promise
  const todoId = Number(id);

  const {
    data: todo,
    isLoading,
    error,
  } = useQuery<Todo>({
    queryKey: ["todo", todoId],
    queryFn: () => fetchTodoById(todoId),
    enabled: !!todoId,
  });

  if (isLoading) return <p>Loading todo...</p>;
  if (error) return <p>Failed to load todo.</p>;
  if (!todo) return <p>Todo not found.</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-100 via-white">
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-md text-center">
        <h2 className="text-2xl font-bold text-blue-700 mb-2">{todo.title}</h2>
        <p className="text-gray-600 mb-4">
          Status:{" "}
          <span className={todo.completed ? "text-green-600" : "text-red-600"}>
            {todo.completed ? "✅ Completed" : "❌ Not completed"}
          </span>
        </p>
        <Link href="/todos">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
            ← Back to Todos
          </button>
        </Link>
      </div>
    </div>
  );
}
