"use client";

import { JobInterface } from "@/types/job";
import { useEffect, useRef, useState } from "react";

export default function RealTimeStats({
  onCompletion,
}: {
  onCompletion: (data: JobInterface) => void;
}) {
  const [updates, setUpdates] = useState<JobInterface[]>([]);
  const [status, setStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");
  const retryCount = useRef(0);
  useEffect(() => {
    const connectWebSocket = () => {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/api/live-stats`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connected");
        setStatus("connected");
        retryCount.current = 0;
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setStatus("disconnected");
        const delay = Math.min(1000 * Math.pow(2, retryCount.current), 30000);
        setTimeout(() => {
          retryCount.current++;
          connectWebSocket();
        }, delay);
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        ws.close();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.jobId) {
            if (data?.status?.toLowerCase() === "completed") {
              onCompletion(data);
            }
            setUpdates((prev) => {
              const updated = prev.filter((job) => job.jobId != data.jobId);
              return [data, ...updated];
            });
          }
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err);
        }
      };
    };

    connectWebSocket();
  }, [onCompletion]);

  return (
    <div className="flex flex-col row-span-3 bg-white shadow rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 font-semibold border-b border-gray-100">
        <span>Live Job Stats</span>
        <span
          className={`text-sm font-medium ${
            status === "connected"
              ? "text-green-500"
              : status === "connecting"
              ? "text-yellow-500"
              : "text-red-500"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Scrollable Table Container */}
      <div className="overflow-y-auto max-h-[22rem]">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-6 py-3">
                Job ID
              </th>
              <th scope="col" className="px-6 py-3">
                File ID
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Message
              </th>
            </tr>
          </thead>
          <tbody>
            {updates.length === 0 ? (
              <tr>
                <td className="px-6 py-4 text-center text-gray-400" colSpan={4}>
                  No recent updates
                </td>
              </tr>
            ) : (
              updates.map((job, i) => (
                <tr
                  key={i}
                  className="bg-white border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">
                    {job.jobId}
                  </td>
                  <td className="px-6 py-4">{job.fileId}</td>
                  <td className="px-6 py-4 capitalize">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                        job.status === "completed"
                          ? "text-green-700 bg-green-100"
                          : job.status === "inprogress"
                          ? "text-blue-700 bg-blue-100"
                          : job.status === "failed"
                          ? "text-red-700 bg-red-100"
                          : "text-gray-700 bg-gray-100"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {job.message || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
