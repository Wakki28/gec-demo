// レイアウトコンポーネント（Sidebar + Header + メインコンテンツ）
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#f4f6fb" }}>
      {/* 左固定サイドバー */}
      <Sidebar />

      {/* 右側コンテンツ */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
