import StatsViewer from "../components/StatsViewer";

export default function ViewJobStats({
  params,
}: {
  params: { jobId: string };
}) {
  const { jobId } = params;

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
        📊 Log Stats for Job ID {jobId}
      </h1>
      <StatsViewer jobId={jobId} />
    </main>
  );
}
