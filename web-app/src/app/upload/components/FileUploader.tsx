"use client";

import { useState } from "react";

export default function FileUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    setUploading(true);
    setError(null);
    setJobId(null);

    try {
      const res = await fetch("/api/upload-logs", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.jobId) {
        setJobId(data.jobId);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err: any) {
      setError("Unexpected error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl mx-auto border border-gray-200 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        📤 Upload Log File
      </h2>

      <label className="block">
        <div className="w-full p-4 border-2 border-dashed rounded-lg border-gray-300 text-center text-gray-500 hover:border-blue-500 cursor-pointer transition-colors">
          {selectedFile ? (
            <span className="font-medium text-gray-700">
              {selectedFile.name}
            </span>
          ) : (
            <span>Click to choose a `.log` file</span>
          )}
          <input
            type="file"
            accept=".log"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="hidden"
          />
        </div>
      </label>

      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
      >
        {uploading ? "Uploading..." : "Upload Log File"}
      </button>

      {jobId && (
        <div className="text-sm bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-md">
          ✅ Upload complete! <br />
          <span className="font-mono text-sm">Job ID: {jobId}</span>
        </div>
      )}

      {error && (
        <div className="text-sm bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md">
          ❌ {error}
        </div>
      )}
    </div>
  );
}
