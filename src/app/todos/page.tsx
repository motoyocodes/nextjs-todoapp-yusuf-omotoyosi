"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, Suspense } from "react";
import { fetchTodos } from "@/lib/todoApi";
import { Todo } from "@/lib/types";
import { TodoForm } from "@/components/createNewTodo";
import { updateATodo } from "@/lib/newTodoApi";
import SuggestPopup from "./suggestpopup";
import {
  FaTrash,
  FaEdit,
  FaSave,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

export default function TodosPage() {
  return (
    <Suspense fallback={<p className="text-gray-500">Loading todos...</p>}>
      <MyTodoList />
    </Suspense>
  );
}

function MyTodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [page, setPage] = useState<number>(1);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState<boolean>(true);
  const todosPerPage = 10;

  const { data, isLoading, error } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  useEffect(() => {
    if (data) setTodos(data);
  }, [data]);

  const handleAddTodo = (newTodo: Omit<Todo, "id">) => {
    const id = todos.length > 0 ? Math.max(...todos.map((t) => t.id!)) + 1 : 1;
    const todoWithId: Todo = { ...newTodo, id };
    setTodos((prev) => [todoWithId, ...prev]);
  };

  const handleToggle = (todo: Todo) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === todo.id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const handleDelete = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodoId(todo.id!);
    setEditedTitle(todo.title);
  };

  const handleSave = async (todo: Todo) => {
    const updatedTodo: Todo = { ...todo, title: editedTitle };
    try {
      const response = await updateATodo(todo.id!, updatedTodo);
      const updatedTodos = todos.map((t) => (t.id === todo.id ? response : t));
      setTodos(updatedTodos);
      setEditingTodoId(null);
      setEditedTitle("");
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  const filteredTodo = todos
    .filter((todo) => todo.title.toLowerCase().includes(search.toLowerCase()))
    .filter((todo) => (isCompleted ? true : !todo.completed));

  const pageToShow = filteredTodo.slice(
    (page - 1) * todosPerPage,
    page * todosPerPage
  );

  if (isLoading) return <p>Loading todos...</p>;
  if (error) return <p>Error loading todos</p>;

  return (
    <main className="relative bg-todos p-4 min-h-screen">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm -z-10" />

      <div className="max-w-3xl mx-auto p-6 rounded-[15px] border border-white/20 bg-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-[50px]">
        <TodoForm onAddTodo={handleAddTodo} />

        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search todos..."
            className="bg-white/20 border border-white/30 text-white placeholder-white/70 font-semibold px-4 py-2 rounded-md w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md shadow-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label className="flex items-center gap-2 text-gray-600">
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={() => setIsCompleted(!isCompleted)}
            />
            Show Completed
          </label>

          <SuggestPopup />
        </div>

        <ul className="space-y-4">
          {pageToShow.map((todo) => (
            <li
              key={todo.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border p-3 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo)}
                  className="accent-blue-500"
                />
                {editingTodoId === todo.id ? (
                  <input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="border px-2 py-1 rounded w-full sm:w-auto"
                  />
                ) : (
                  <Link
                    href={`/todos/${todo.id}`}
                    className="text-lg text-blue-700 hover:underline font-medium"
                  >
                    {todo.title} — {todo.completed ? "✅" : "❌"}
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDelete(todo.id!)}
                  className="text-red-500 cursor-pointer hover:text-red-700"
                >
                  <FaTrash />
                </button>
                {editingTodoId === todo.id ? (
                  <button
                    onClick={() => handleSave(todo)}
                    className="text-green-500 cursor-pointer hover:text-green-700 flex items-center gap-1"
                  >
                    <FaSave /> Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(todo)}
                    className="text-yellow-500 cursor-pointer hover:text-yellow-600 flex items-center gap-1"
                  >
                    <FaEdit /> Edit
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex items-center justify-between text-gray-600">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            <FaArrowLeft /> Prev
          </button>
          <span className="font-semibold">Page {page}</span>
          <button
            disabled={page * todosPerPage >= filteredTodo.length}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            Next <FaArrowRight />
          </button>
        </div>

        <Link href="/" className="block mt-6 text-center">
          <button className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
            ← Back to HomePage
          </button>
        </Link>
      </div>
    </main>
  );
}
