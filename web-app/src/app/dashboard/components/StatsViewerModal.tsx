"use client";

import { useEffect, useReducer } from "react";
import { X } from "lucide-react";

type StatsData = {
  job_id: string;
  file_id: string;
  stats: Record<string, number>;
  ip_addresses: string[];
  errors: Array<{
    level: string;
    message: string;
    jsonPayload: Record<string, unknown>;
    ip: string | null;
  }>;
  created_at: string;
};

type Props = {
  jobId: string;
  isOpen: boolean;
  onClose: () => void;
};

type State = {
  loading: boolean;
  error: string | null;
  data: StatsData | null;
};

type Action =
  | { type: "LOADING" }
  | { type: "SUCCESS"; payload: StatsData }
  | { type: "ERROR"; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null, data: null };
    case "SUCCESS":
      return { loading: false, error: null, data: action.payload };
    case "ERROR":
      return { loading: false, error: action.payload, data: null };
    default:
      return state;
  }
}

export default function StatsViewerModal({ jobId, isOpen, onClose }: Props) {
  const [state, dispatch] = useReducer(reducer, {
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    if (!jobId || !isOpen) return;

    const fetchStats = async () => {
      dispatch({ type: "LOADING" });
      try {
        const res = await fetch(`/api/stats/${jobId}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || "Failed to fetch stats");
        dispatch({ type: "SUCCESS", payload: json.data });
      } catch (err: any) {
        dispatch({ type: "ERROR", payload: err.message });
      }
    };

    fetchStats();
  }, [jobId, isOpen]);

  const { loading, error, data } = state;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-3xl mx-auto bg-white rounded-xl shadow-2xl max-h-[90vh] animate-fade-in-up flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between rounded-t-xl">
          <h2 className="text-lg font-semibold text-gray-800">
            Parsed Log Stats
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-4 space-y-6 text-sm text-gray-800">
          {loading && <p className="text-gray-500">Fetching data...</p>}
          {error && <p className="text-red-500">❌ {error}</p>}

          {!loading && !error && data && (
            <>
              {/* Stats */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  📌 Stats Summary
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4 list-disc">
                  {Object.entries(data.stats).map(([k, v]) => (
                    <li key={k}>
                      <span className="font-mono">{k}</span>: {v}
                    </li>
                  ))}
                </ul>
              </div>

              {/* IPs */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  🌐 IP Addresses
                </h3>
                <ul className="pl-4 list-disc">
                  {data.ip_addresses.map((ip) => (
                    <li key={ip}>
                      <span className="font-mono">{ip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Errors */}
              {data.errors.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    ❗ Extracted Errors
                  </h3>
                  <ul className="space-y-4">
                    {data.errors.map((err, idx) => (
                      <li
                        key={idx}
                        className="p-3 border-l-4 border-red-500 bg-red-50 rounded"
                      >
                        <div className="font-semibold text-red-700">
                          {err.level}: {err.message}
                        </div>
                        {err.ip && (
                          <div className="text-xs text-gray-500 mt-1">
                            IP: {err.ip}
                          </div>
                        )}
                        {err.jsonPayload && (
                          <pre className="text-xs text-gray-600 bg-white border rounded p-2 mt-2 overflow-auto max-h-40">
                            {JSON.stringify(err.jsonPayload, null, 2)}
                          </pre>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-xs text-gray-400">
                ⏱️ Processed at: {new Date(data.created_at).toLocaleString()}
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
