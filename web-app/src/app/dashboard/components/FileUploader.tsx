"use client";

import { useRef, useState } from "react";

export default function FileUploadButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setError(null);
    setJobId(null);

    try {
      const res = await fetch("/api/upload-logs", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data?.data?.jobId) {
        setJobId(data.jobId);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err: any) {
      setError("Unexpected error: " + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; // reset file input
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".log"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        onClick={triggerFileInput}
        disabled={uploading}
        className="inline-flex px-5 py-3 text-white bg-purple-600 hover:bg-purple-700 focus:bg-purple-700 rounded-md ml-6 mb-3 cursor-pointer"
      >
        <svg
          aria-hidden="true"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="flex-shrink-0 h-6 w-6 text-white -ml-1 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        {uploading ? "Uploading..." : "Upload Log File"}
      </button>

      {/* {jobId && (
        <div className="text-sm bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-md">
          ✅ Upload complete! <br />
          <span className="font-mono text-sm">Job ID: {jobId}</span>
        </div>
      )}

      {error && (
        <div className="text-sm bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md">
          ❌ {error}
        </div>
      )} */}
    </div>
  );
}
