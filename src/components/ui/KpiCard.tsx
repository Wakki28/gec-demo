// KPIカードコンポーネント
import type { ReactNode } from "react";

type KpiCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: {
    label: string;
    icon: ReactNode;
    positive: boolean;
  };
};

export default function KpiCard({ title, value, icon, trend }: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e8ecf0]">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500 font-medium">{title}</span>
        <div className="w-10 h-10 rounded-lg bg-[#eef1fd] flex items-center justify-center text-[#4361ee]">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-2">{value}</div>
      {trend && (
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            trend.positive ? "text-[#2a9d5c]" : "text-[#e63946]"
          }`}
        >
          {trend.icon}
          <span>{trend.label}</span>
        </div>
      )}
    </div>
  );
}
