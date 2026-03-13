// ヘッダーコンポーネント（現在日時リアルタイム表示）
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Bell } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/": "ダッシュボード",
  "/production": "製造実績",
  "/defect": "不良管理",
  "/stoppage": "ライン停止",
  "/order": "受発注変換",
};

export default function Header() {
  const location = useLocation();
  const [now, setNow] = useState(new Date());

  // 1秒ごとに時刻を更新
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pageTitle = pageTitles[location.pathname] ?? "";

  const formattedDate = now.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });

  const formattedTime = now.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header className="h-14 bg-white border-b border-[#e8ecf0] flex items-center justify-between px-6 shrink-0">
      <h2 className="text-base font-semibold text-gray-800">{pageTitle}</h2>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-500">
          <span>{formattedDate}</span>
          <span className="ml-2 font-mono">{formattedTime}</span>
        </div>
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={18} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#e63946] rounded-full" />
        </button>
      </div>
    </header>
  );
}
