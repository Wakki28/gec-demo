// アプリケーションルート（React Router設定）
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import ProductionRecord from "./pages/ProductionRecord";
import DefectManagement from "./pages/DefectManagement";
import LineStoppage from "./pages/LineStoppage";
import OrderConversion from "./pages/OrderConversion";
import MasterManagement from "./pages/MasterManagement";
import Login from "./pages/Login";

// 認証状態に応じてルーティングを切り替える内部コンポーネント
function AppRoutes() {
  const { currentUser } = useAuth();

  // 未ログイン時はログイン画面を表示
  if (!currentUser) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="production" element={<ProductionRecord />} />
        <Route path="defect" element={<DefectManagement />} />
        <Route path="stoppage" element={<LineStoppage />} />
        <Route path="order" element={<OrderConversion />} />
        <Route path="master" element={<MasterManagement />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
