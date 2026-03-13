// アプリケーションルート（React Router設定）
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import ProductionRecord from "./pages/ProductionRecord";
import DefectManagement from "./pages/DefectManagement";
import LineStoppage from "./pages/LineStoppage";
import OrderConversion from "./pages/OrderConversion";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="production" element={<ProductionRecord />} />
          <Route path="defect" element={<DefectManagement />} />
          <Route path="stoppage" element={<LineStoppage />} />
          <Route path="order" element={<OrderConversion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
