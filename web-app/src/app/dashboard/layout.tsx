// app/(dashboard)/layout.tsx
import React from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | File processor",
  description: "Manage you log files with ease",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100 w-full">
      <div className="flex flex-col flex-1 w-full overflow-x-hidden">
        <Header />
        <main className="flex-1 px-4 sm:px-6 md:px-10 py-6 space-y-6 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
