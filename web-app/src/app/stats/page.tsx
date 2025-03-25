"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JobLookupPage() {
  const [jobId, setJobId] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId.trim()) return;
    router.push(`/stats/${jobId.trim()}`);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        🔍 View Log Stats
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter Job ID..."
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
        >
          View Stats
        </button>
      </form>
    </main>
  );
}
