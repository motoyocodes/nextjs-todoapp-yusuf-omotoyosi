"use client";

import { useState } from "react";

export default function SuggestBox() {
  const [topic, setTopic] = useState("");
  const [ideas, setIdeas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mock, setMock] = useState(false); // track if suggestions are mock

  const handleSuggest = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setError("");
    setIdeas([]);
    setMock(false);

    const currentTopic = topic.trim();
    setTopic(""); // Clear input immediately

    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: currentTopic }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get suggestions");

      setIdeas(data.items || []);
      if (data.mock) setMock(true); // mark if fallback suggestions were returned
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 mt-10 text-center max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">
        Get your AI Todo Suggestions
      </h2>

      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g. studying, fitness, cleaning)"
          className="border border-gray-400 rounded-lg px-4 py-2 w-full sm:w-80 focus:ring-2 focus:ring-blue-300 focus:outline-none text-gray-800 placeholder-gray-400"
        />
        <button
          onClick={handleSuggest}
          disabled={loading}
          className="relative flex items-center justify-center px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
        >
          {loading && (
            <span className="absolute cursor-pointer left-4 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? "Thinking..." : "Suggest Todos"}
        </button>
      </div>

      {mock && (
        <p className="text-yellow-600 mt-4 text-sm">
          ⚙️ AI temporarily unavailable — showing mock suggestions.
        </p>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {ideas.length > 0 && (
        <ul className="mt-6 text-left max-w-md mx-auto list-disc list-inside space-y-2 text-gray-800">
          {ideas.map((idea, i) => (
            <li key={i}>{idea}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
