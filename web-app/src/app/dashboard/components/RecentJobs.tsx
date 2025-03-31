"use client";

import { Link } from "lucide-react";
import moment from "moment";

interface JobUpdate {
  job_id: string;
  file_id: string;
  status: string;
  created_at: string;
  ip_addresses?: string[];
  message?: string;
  errors?: Array<{
    level: string;
    message: string;
    ip?: string;
  }>;
}

export default function RecentJobs({
  jobs,
  isLoading,
}: {
  jobs: JobUpdate[];
  isLoading: boolean;
}) {
  return (
    <div className="flex flex-col row-span-3 bg-white shadow rounded-lg">
      <div className="flex items-center justify-between px-6 py-5 font-semibold border-b border-gray-100">
        <span>Recent Job Issues</span>
      </div>
      <div className="relative overflow-x-auto rounded-md border border-gray-200 bg-white shadow max-h-[24rem] overflow-y-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Job ID</th>
              <th className="px-6 py-3">File ID</th>
              <th className="px-6 py-3">Created At</th>
              <th className="px-6 py-3">Total Errors</th>
              <th className="px-6 py-3">Total IPs</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr className="text-center text-gray-400">
                <td className="px-6 py-4" colSpan={5}>
                  Loading...
                </td>
              </tr>
            ) : jobs.length === 0 ? (
              <tr className="text-center text-gray-400">
                <td className="px-6 py-4" colSpan={5}>
                  No recent jobs
                </td>
              </tr>
            ) : (
              jobs.map((job, i) => (
                <tr
                  key={i}
                  className="bg-white border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">
                    {job.job_id}
                  </td>
                  <td className="px-6 py-4">
                    {job?.file_id?.split("-")?.pop()}
                  </td>
                  <td className="px-6 py-4">
                    {moment(job.created_at).format("Do MMM YYYY h:m a")}
                  </td>
                  <td className="px-6 py-4">{job.errors?.length}</td>
                  <td className="px-6 py-4">
                    {job.ip_addresses ? job.ip_addresses.length : 0}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/jobs/${job.job_id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Get Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
            {}
          </tbody>
        </table>
      </div>
    </div>
  );
}
