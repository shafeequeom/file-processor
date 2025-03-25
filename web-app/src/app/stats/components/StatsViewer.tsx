"use client";

import { useEffect, useReducer } from "react";

type StatsData = {
  job_id: string;
  file_id: string;
  stats: Record<string, number>;
  ip_addresses: string[];
  errors: Array<{
    level: string;
    message: string;
    jsonPayload: any;
    ip: string | null;
  }>;
  created_at: string;
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

export default function StatsViewer({ jobId }: { jobId: string }) {
  const [state, dispatch] = useReducer(reducer, {
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      dispatch({ type: "LOADING" });
      try {
        const res = await fetch(`/api/stats/${jobId}`);
        if (!res.ok) {
          throw new Error(`Stats not found (status: ${res.status})`);
        }
        const data = await res.json();
        dispatch({ type: "SUCCESS", payload: data.data });
      } catch (err: any) {
        dispatch({
          type: "ERROR",
          payload: err.message || "Error fetching stats",
        });
      }
    };

    fetchStats();
  }, [jobId]);

  const { loading, error, data } = state;

  if (loading)
    return <p className="text-sm text-gray-500">Fetching stats...</p>;
  if (error) return <p className="text-sm text-red-500">❌ {error}</p>;
  if (!data) return null;

  console.log(data);

  return (
    <div className="mt-6 p-6 border border-gray-200 rounded-xl max-w-xxl mx-auto  shadow-sm bg-white space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">
        📊 Parsed Log Stats
      </h3>

      <div>
        <p className="text-sm text-gray-600 mb-1 font-medium">📌 Stats:</p>
        <ul className="pl-4 list-disc text-sm text-gray-700">
          {Object.entries(data.stats).map(([key, count]) => (
            <li key={key}>
              <span className="font-mono">{key}</span>: {count}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-1 font-medium">
          🌐 IP Addresses:
        </p>
        <ul className="pl-4 list-disc text-sm text-gray-700">
          {data.ip_addresses.map((ip) => (
            <li key={ip}>
              <span className="font-mono">{ip}</span>
            </li>
          ))}
        </ul>
      </div>

      {data.errors?.length > 0 && (
        <div>
          <p className="text-sm text-gray-600 mb-1 font-medium">
            ❗ Extracted Errors:
          </p>
          <ul className="pl-4 list-disc text-sm text-gray-700 space-y-1">
            {data.errors.map((err, idx) => (
              <li key={idx}>
                <div>
                  <span className="font-semibold text-red-600">
                    {err.level}
                  </span>
                  : {err.message}
                </div>
                {err.ip && (
                  <div className="text-xs text-gray-500">IP: {err.ip}</div>
                )}
                {err.jsonPayload && (
                  <pre className="text-xs text-gray-400 bg-gray-100 p-2 rounded mt-1">
                    {JSON.stringify(err.jsonPayload, null, 2)}
                  </pre>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-4">
        Processed at: {new Date(data.created_at).toLocaleString()}
      </p>
    </div>
  );
}
