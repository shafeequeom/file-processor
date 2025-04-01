"use client";

import { ServerCrash, Cpu, Computer, AlertTriangle, Eye } from "lucide-react";
import StatsCard from "./components/StatsCard";
import RealTimeStats from "./components/RealTimeStats";
import RecentJobs from "./components/RecentJobs";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import FileUploadButton from "./components/FileUploader";
import { JobInterface } from "@/type/common";
import StatsViewerModal from "./components/StatsViewerModal";
import QueueStatusCard from "./components/QueueStatusCard";

export default function DashboardPage() {
  const [statusData, setStatusData] = useState({});
  const [jobsData, setJobsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [jobId, setJobId] = useState("");
  const [showModal, setShowModal] = useState(false);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setStatusData({});
    setJobsData([]);
    try {
      const res = await fetch("/api/stats", {
        method: "GET",
      });

      if (res.ok) {
        const data = await res.json();
        const { recentJobs, ...stats } = data?.data;
        setStatusData(stats || {});
        setJobsData(recentJobs || []);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        toast.error("Failed to load dashboard data");
      }
    } catch (err: any) {
      setIsLoading(false);
      toast.error("Unexpected error: " + err.message);
    }
  };

  const handleRecentJobUpdate = (jobData: JobInterface) => {
    console.log("Job update:", jobData);
    const transformedData = {
      file_id: jobData.fileId,
      job_id: jobData.jobId,
      status: jobData.status,
      message: jobData.message,
      stats: jobData.stats,
      ip_addresses: jobData.ipAddresses,
      errors: jobData.errors,
    };

    setJobsData((prevJobs: any) => {
      const existingJobIndex = prevJobs.findIndex(
        (j) => j.jobId === jobData.jobId
      );
      if (existingJobIndex !== -1) {
        const updatedJobs = [...prevJobs];
        updatedJobs[existingJobIndex] = transformedData;
        return updatedJobs;
      }
      return [transformedData, ...prevJobs];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = e.target as HTMLFormElement;
    const jobIdInput = input.jobId.value.trim();
    if (!jobIdInput) {
      toast.error("Please enter a job ID");
      return;
    }
    setJobId(jobIdInput);
    setShowModal(true);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <>
      <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
        <div className="mr-6">
          <h1 className="text-4xl font-semibold mb-2">Dashboard</h1>
          <h2 className="text-gray-600 ml-0.5">Jobs Analytics </h2>
        </div>
        <div className="flex flex-wrap justify-end gap-4">
          <form onSubmit={handleSubmit}>
            <div className="flex h-12 border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-purple-500">
              <input
                type="text"
                name="jobId"
                placeholder="Enter Job ID..."
                className="w-52 px-4 text-sm text-gray-700 focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-2 px-4 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition"
              >
                <Eye className="h-4 w-4" />
                View Status
              </button>
            </div>
          </form>

          <FileUploadButton />
        </div>
      </div>

      {/* Stats Cards */}
      <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatsCard
          icon={Cpu}
          value={statusData?.totalJobs || "0"}
          label="Total Jobs"
          iconColor="text-green-600"
          bgColor="bg-green-100"
        />
        <StatsCard
          icon={ServerCrash}
          value={statusData?.uniqueIPCount || "0"}
          label="Total Failed Jobs"
          iconColor="text-red-600"
          bgColor="bg-red-100"
        />
        <StatsCard
          icon={Computer}
          value={statusData?.uniqueIPCount || "0"}
          label="Total IPs tracked"
          iconColor="text-blue-600"
          bgColor="bg-blue-100"
        />
        <StatsCard
          icon={AlertTriangle}
          value={statusData?.totalErrors || "0"}
          label={"Total Errors Tracked"}
          iconColor="text-orange-600"
          bgColor="bg-orange-100"
        />
      </section>

      <section className="grid md:grid-cols-1 xl:grid-cols-1 gap-6">
        <QueueStatusCard />
      </section>

      {/* Lower Grid */}
      <section className="grid grid-cols-1 xl:grid-cols-4 xl:grid-rows-3 xl:grid-flow-col gap-6">
        <div className="col-span-2 row-span-2">
          <RecentJobs jobs={jobsData} isLoading={isLoading} />
        </div>
        <div className="col-span-2 row-span-3">
          <RealTimeStats onCompletion={handleRecentJobUpdate} />
        </div>
      </section>

      <StatsViewerModal
        jobId={jobId}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
