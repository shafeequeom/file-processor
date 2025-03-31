"use client";

import { LucideIcon } from "lucide-react";
import clsx from "clsx";

type StatsCardProps = {
  icon: LucideIcon;
  value: string | number;
  label: string;
  iconColor?: string;
  bgColor?: string;
};

export default function StatsCard({
  icon: Icon,
  value,
  label,
  iconColor = "text-purple-600",
  bgColor = "bg-purple-100",
}: StatsCardProps) {
  return (
    <div className="flex items-center p-6 bg-white shadow rounded-lg">
      <div
        className={clsx(
          "inline-flex items-center justify-center h-14 w-14 rounded-full mr-6",
          iconColor,
          bgColor
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <span className="block text-2xl font-bold">{value}</span>
        <span className="block text-gray-500">{label}</span>
      </div>
    </div>
  );
}
