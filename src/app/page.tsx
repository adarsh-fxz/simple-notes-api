"use client";
import React, { useEffect, useState } from "react";

interface Note {
  id: number;
  title: string;
  description: string;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNotes = async () => {
    setLoading(true);
    const res = await fetch("/api/notes");
    const data = await res.json();
    setNotes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim() || !description.trim()) {
      setError("Title and Description are required.");
      return;
    }
    setLoading(true);
    if (editingId === null) {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Failed to add note.");
      }
    } else {
      const res = await fetch("/api/notes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, title, description }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Failed to update note.");
      }
    }
    setTitle("");
    setDescription("");
    setEditingId(null);
    setLoading(false);
    fetchNotes();
  };

  const handleEdit = (note: Note) => {
    setTitle(note.title);
    setDescription(note.description);
    setEditingId(note.id);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    const res = await fetch("/api/notes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setLoading(false);
    fetchNotes();
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Notes</h1>
      <form onSubmit={handleSubmit} className="mb-6 bg-white dark:bg-zinc-900 p-4 rounded">
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={loading}
        />
        <textarea
          className="w-full mb-2 p-2 border rounded"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          disabled={loading}
        />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
          disabled={loading}
        >
          {editingId === null ? "Add Note" : "Update Note"}
        </button>
        {editingId !== null && (
          <button
            type="button"
            className="ml-2 px-4 py-2 rounded border border-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
            onClick={() => {
              setTitle("");
              setDescription("");
              setEditingId(null);
            }}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </form>
      {loading && <div className="text-center">Loading...</div>}
      <div className="space-y-4">
        {notes.length === 0 && !loading && (
          <div className="text-center text-gray-500">No notes yet.</div>
        )}
        {notes.map(note => (
          <div key={note.id} className="bg-white dark: bg-zinc-900 p-4 rounded shadow flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{note.title}</h2>
              <div className="flex gap-2">
                <button
                  className="text-blue-600 hover:underline cursor-pointer"
                  onClick={() => handleEdit(note)}
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  className="text-blue-600 hover:underline cursor-pointer"
                  onClick={() => handleDelete(note.id)}
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{note.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
