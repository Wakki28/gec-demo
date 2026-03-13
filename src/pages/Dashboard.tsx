// ダッシュボードページ
import {
  Package,
  AlertCircle,
  Activity,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import KpiCard from "../components/ui/KpiCard";
import StatusBadge from "../components/ui/StatusBadge";
import DataTable from "../components/ui/DataTable";
import { productionRecords, monthlyProductionData, monthlyDefectRateData } from "../data/mockData";
import type { ProductionRecord } from "../types";

// 達成率からバッジvariantを決定
function getAchievementVariant(rate: number): "success" | "warning" | "danger" {
  if (rate >= 100) return "success";
  if (rate >= 90) return "warning";
  return "danger";
}

// 直近5件の製造実績
const recentRecords = [...productionRecords]
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 5);

const tableColumns = [
  { key: "date", header: "日付", render: (r: ProductionRecord) => r.date },
  { key: "line", header: "ライン", render: (r: ProductionRecord) => r.lineName },
  { key: "worker", header: "作業者", render: (r: ProductionRecord) => r.workerName },
  { key: "product", header: "製品名", render: (r: ProductionRecord) => r.productName },
  { key: "actual", header: "実績数", render: (r: ProductionRecord) => r.actualCount.toLocaleString() },
  {
    key: "rate",
    header: "達成率",
    render: (r: ProductionRecord) => {
      const rate = Math.round((r.actualCount / r.plannedCount) * 100);
      return (
        <StatusBadge
          label={`${rate}%`}
          variant={getAchievementVariant(rate)}
        />
      );
    },
  },
];

export default function Dashboard() {
  return (
    <div>
      {/* KPIカード */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard
          title="今月の生産数"
          value="12,450個"
          icon={<Package size={20} />}
          trend={{
            label: "前月比 +3.2%",
            icon: <TrendingUp size={14} />,
            positive: true,
          }}
        />
        <KpiCard
          title="不良率"
          value="0.8%"
          icon={<AlertCircle size={20} />}
          trend={{
            label: "前月比 -0.2pt",
            icon: <TrendingDown size={14} />,
            positive: true,
          }}
        />
        <KpiCard
          title="ライン稼働率"
          value="94.2%"
          icon={<Activity size={20} />}
          trend={{
            label: "前月比 +1.1%",
            icon: <TrendingUp size={14} />,
            positive: true,
          }}
        />
        <KpiCard
          title="ライン停止時間"
          value="18.5h"
          icon={<Clock size={20} />}
          trend={{
            label: "前月比 -12.0%",
            icon: <TrendingDown size={14} />,
            positive: true,
          }}
        />
      </div>

      {/* グラフ */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* 月別生産数BarChart */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#e8ecf0]">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">月別生産数（計画 vs 実績）</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyProductionData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="planned" name="計画" fill="#a5b4fc" radius={[3, 3, 0, 0]} />
              <Bar dataKey="actual" name="実績" fill="#4361ee" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 不良率トレンドLineChart */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#e8ecf0]">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">不良率トレンド（ライン別）</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyDefectRateData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, 2.5]} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="line1" name="ライン1" stroke="#4361ee" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="line2" name="ライン2" stroke="#2a9d5c" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="line3" name="ライン3" stroke="#e07b00" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="line4" name="ライン4" stroke="#e63946" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 直近製造実績テーブル */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e8ecf0]">
        <div className="px-5 py-4 border-b border-[#e8ecf0]">
          <h3 className="text-sm font-semibold text-gray-700">直近の製造実績</h3>
        </div>
        <DataTable columns={tableColumns} data={recentRecords} />
      </div>
    </div>
  );
}
