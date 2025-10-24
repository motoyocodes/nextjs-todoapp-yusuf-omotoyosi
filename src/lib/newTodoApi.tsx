import axios from "axios";
import type { Todo } from "./types";

const TODO_API_URL = "https://jsonplaceholder.typicode.com/todos";

export const updateATodo = async (
  id: number,
  updatedTodo: Partial<Todo> // partial so we dont use everything
): Promise<Todo> => {
  const res = await axios.put<Todo>(`${TODO_API_URL}/${id}`, updatedTodo);
  return res.data;
};
