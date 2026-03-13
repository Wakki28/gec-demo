// サイドバーコンポーネント
import { NavLink } from "react-router-dom";
import {
  Factory,
  LayoutDashboard,
  ClipboardList,
  AlertTriangle,
  PauseCircle,
  ArrowLeftRight,
  UserCircle,
} from "lucide-react";

type NavItem = {
  icon: React.ReactNode;
  label: string;
  to: string;
};

const navItems: NavItem[] = [
  { icon: <LayoutDashboard size={18} />, label: "ダッシュボード", to: "/" },
  { icon: <ClipboardList size={18} />, label: "製造実績", to: "/production" },
  { icon: <AlertTriangle size={18} />, label: "不良管理", to: "/defect" },
  { icon: <PauseCircle size={18} />, label: "ライン停止", to: "/stoppage" },
  { icon: <ArrowLeftRight size={18} />, label: "受発注変換", to: "/order" },
];

export default function Sidebar() {
  return (
    <aside
      className="flex flex-col h-screen shrink-0"
      style={{ width: 240, backgroundColor: "#1a1a2e" }}
    >
      {/* ロゴ・タイトル */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
        <Factory size={22} className="text-[#4361ee]" />
        <span className="text-white text-sm font-semibold leading-tight">
          製造実績管理システム
        </span>
      </div>

      {/* ナビゲーション */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                isActive
                  ? "text-white bg-white/10 border-l-4 border-[#4361ee] pl-4"
                  : "text-white/60 hover:text-white hover:bg-white/5 border-l-4 border-transparent pl-4"
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ログインユーザー */}
      <div className="px-5 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <UserCircle size={32} className="text-white/60 shrink-0" />
          <div>
            <div className="text-white text-sm font-medium">田中 誠</div>
            <div className="text-white/40 text-xs">EMP001</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
