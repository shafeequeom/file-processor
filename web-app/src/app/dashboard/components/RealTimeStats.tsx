// components/RealTimeStats.tsx
"use client"; // <-- Add this directive

import { useEffect, useState, useCallback } from "react";

export default function RealTimeStats() {
  const [updates, setUpdates] = useState<any[]>([]);
  const [status, setStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");
  const [wsInstance, setWsInstance] = useState<WebSocket | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const connectWebSocket = useCallback(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/api/live-stats`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setStatus("connected");
      setRetryCount(0);
    };

    ws.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
      setStatus("disconnected");

      // Attempt reconnection with exponential backoff
      const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
      setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        connectWebSocket();
      }, delay);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setStatus("disconnected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setUpdates((prev) => [...prev.slice(-9), data]); // Keep last 10 updates
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    setWsInstance(ws);
  }, [retryCount]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsInstance) {
        wsInstance.close();
      }
    };
  }, [connectWebSocket]);

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-2">Real-Time Updates</h2>
      <div className="mb-2">
        Status:{" "}
        <span
          className={`font-semibold ${
            status === "connected"
              ? "text-green-500"
              : status === "connecting"
              ? "text-yellow-500"
              : "text-red-500"
          }`}
        >
          {status}{" "}
          {status === "disconnected" &&
            `(retrying in ${Math.min(30, Math.pow(2, retryCount))}s)`}
        </span>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {updates.map((update, i) => (
          <div key={i} className="p-2 bg-gray-100 rounded">
            <pre className="text-xs">{JSON.stringify(update, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
