"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Logs } from "lucide-react";
import { toast } from "react-toastify";

type QueueStats = {
  active: number;
  completed: number;
  delayed: number;
  failed: number;
  paused: number;
  waiting: number;
};

export default function QueueStatusCard() {
  const [status, setStatus] = useState<QueueStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueueStatus = async () => {
      try {
        const res = await fetch("/api/queue-status");
        const json = await res.json();

        if (res.ok) {
          setStatus(json.data);
        } else {
          toast.error(json.message || "Failed to fetch queue status");
        }
      } catch (err: any) {
        toast.error("Unexpected error: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQueueStatus();
  }, []);

  const statusColors: Record<string, string> = {
    active: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    delayed: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
    paused: "bg-gray-100 text-gray-700",
    waiting: "bg-purple-100 text-purple-800",
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-200 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-violet-600 flex items-center gap-2">
          <Logs />
          Queue Status
        </h2>
        {!loading && !status && (
          <div className="flex items-center text-sm gap-1 text-red-500">
            <AlertCircle className="text-red-500" size={20} />{" "}
            <span>Error fetching queue status</span>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Fetching queue status...</p>
      ) : (
        status && (
          <div className="grid grid-cols-6 sm:grid-cols-6 gap-4 mt-2">
            {Object.entries(status).map(
              ([key, value]) =>
                // Ensure the key is a string
                statusColors[key] && (
                  <div
                    key={key}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg shadow-sm border ${
                      statusColors[key] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <span className="capitalize font-medium">{key}</span>
                    <span className="font-bold">{value}</span>
                  </div>
                )
            )}
          </div>
        )
      )}
    </div>
  );
}
