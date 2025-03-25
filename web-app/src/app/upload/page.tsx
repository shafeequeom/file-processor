import FileUploader from "./components/FileUploader";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Push your logs!!
      </h1>
      <FileUploader />
    </main>
  );
}
