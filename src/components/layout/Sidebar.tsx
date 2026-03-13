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
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

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
  const { currentUser, logout, isAdmin } = useAuth();

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

        {/* マスタ管理（管理者のみ表示） */}
        {isAdmin && (
          <NavLink
            to="/master"
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                isActive
                  ? "text-white bg-white/10 border-l-4 border-[#4361ee] pl-4"
                  : "text-white/60 hover:text-white hover:bg-white/5 border-l-4 border-transparent pl-4"
              }`
            }
          >
            <Settings size={18} />
            <span>マスタ管理</span>
          </NavLink>
        )}
      </nav>

      {/* ログインユーザー・ログアウト */}
      <div className="px-5 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <UserCircle size={32} className="text-white/60 shrink-0" />
          <div>
            <div className="text-white text-sm font-medium">{currentUser?.name ?? ''}</div>
            <div className="text-white/40 text-xs">{currentUser?.employeeNumber ?? ''}</div>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <LogOut size={14} />
          <span>ログアウト</span>
        </button>
      </div>
    </aside>
  );
}
