// 不良管理ページ
import { useState } from "react";
import { Plus, X } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import PageHeader from "../components/ui/PageHeader";
import StatusBadge from "../components/ui/StatusBadge";
import DataTable from "../components/ui/DataTable";
import { defectRecords as initialRecords, lines, productNames } from "../data/mockData";
import type { DefectRecord } from "../types";

// 不良種別オプション
const defectTypes = ["寸法不良", "外観不良", "機能不良", "その他"];

// PieChart用カラー
const PIE_COLORS = ["#4361ee", "#2a9d5c", "#e07b00", "#e63946"];

// 不良率バッジ variant
function getDefectVariant(rate: number): "success" | "warning" | "danger" {
  if (rate < 0.8) return "success";
  if (rate < 1.5) return "warning";
  return "danger";
}

// 不良種別集計（PieChart用）
function buildPieData(records: DefectRecord[]) {
  const map: Record<string, number> = {};
  records.forEach((r) => {
    map[r.defectType] = (map[r.defectType] ?? 0) + r.defectCount;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

// ライン別不良率推移（LineChart用・直近3ヶ月）
function buildLineData(records: DefectRecord[]) {
  const months = ["2025-12", "2026-01", "2026-02"];
  return months.map((month) => {
    const entry: Record<string, string | number> = { month };
    ["L1", "L2", "L3", "L4"].forEach((lid) => {
      const recs = records.filter((r) => r.date.startsWith(month) && r.lineId === lid);
      if (recs.length > 0) {
        const avg = recs.reduce((s, r) => s + r.defectRate, 0) / recs.length;
        entry[`line${lid.slice(1)}`] = parseFloat(avg.toFixed(2));
      } else {
        entry[`line${lid.slice(1)}`] = 0;
      }
    });
    return entry;
  });
}

// 空フォーム
const emptyForm = {
  date: "",
  lineId: "",
  productName: "",
  defectType: "",
  totalCount: "",
  defectCount: "",
  note: "",
};

type FormData = typeof emptyForm;
type FormErrors = Partial<Record<keyof FormData, string>>;

export default function DefectManagement() {
  const [records, setRecords] = useState<DefectRecord[]>(initialRecords);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  // 今月（2026-02）のデータ
  const thisMonth = records.filter((r) => r.date.startsWith("2026-02"));

  const totalDefects = thisMonth.reduce((s, r) => s + r.defectCount, 0);
  const avgRate =
    thisMonth.length > 0
      ? (thisMonth.reduce((s, r) => s + r.defectRate, 0) / thisMonth.length).toFixed(2)
      : "0.00";
  const typeCount: Record<string, number> = {};
  thisMonth.forEach((r) => {
    typeCount[r.defectType] = (typeCount[r.defectType] ?? 0) + r.defectCount;
  });
  const topType =
    Object.keys(typeCount).length > 0
      ? Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0][0]
      : "-";

  const pieData = buildPieData(records);
  const lineData = buildLineData(records);

  // リアルタイム不良率計算
  const calcRate =
    form.totalCount && form.defectCount && Number(form.totalCount) > 0
      ? ((Number(form.defectCount) / Number(form.totalCount)) * 100).toFixed(2)
      : null;

  // バリデーション
  function validate(): boolean {
    const errs: FormErrors = {};
    if (!form.date) errs.date = "日付は必須です";
    if (!form.lineId) errs.lineId = "ラインは必須です";
    if (!form.productName) errs.productName = "製品名は必須です";
    if (!form.defectType) errs.defectType = "不良種別は必須です";
    if (!form.totalCount || isNaN(Number(form.totalCount)) || Number(form.totalCount) <= 0)
      errs.totalCount = "検査数は正の数値で入力してください";
    if (!form.defectCount || isNaN(Number(form.defectCount)) || Number(form.defectCount) < 0)
      errs.defectCount = "不良数は0以上の数値で入力してください";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const lineData2 = lines.find((l) => l.id === form.lineId)!;
    const total = Number(form.totalCount);
    const defect = Number(form.defectCount);
    const rate = parseFloat(((defect / total) * 100).toFixed(2));
    const newRecord: DefectRecord = {
      id: `DF${String(records.length + 1).padStart(3, "0")}`,
      date: form.date,
      lineId: lineData2.id,
      lineName: lineData2.name,
      productName: form.productName,
      defectType: form.defectType,
      totalCount: total,
      defectCount: defect,
      defectRate: rate,
      note: form.note,
    };
    setRecords([newRecord, ...records]);
    setShowModal(false);
    setForm(emptyForm);
    setErrors({});
  }

  const columns = [
    { key: "date", header: "日付", render: (r: DefectRecord) => r.date },
    { key: "line", header: "ライン", render: (r: DefectRecord) => r.lineName },
    { key: "product", header: "製品名", render: (r: DefectRecord) => r.productName },
    { key: "type", header: "不良種別", render: (r: DefectRecord) => r.defectType },
    { key: "total", header: "検査数", render: (r: DefectRecord) => r.totalCount.toLocaleString() },
    { key: "defect", header: "不良数", render: (r: DefectRecord) => r.defectCount },
    {
      key: "rate",
      header: "不良率",
      render: (r: DefectRecord) => (
        <StatusBadge label={`${r.defectRate}%`} variant={getDefectVariant(r.defectRate)} />
      ),
    },
    { key: "note", header: "備考", render: (r: DefectRecord) => r.note || "-" },
  ];

  return (
    <div>
      <PageHeader
        title="不良管理"
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm bg-[#4361ee] text-white rounded-lg hover:bg-[#3451d1] transition-colors"
          >
            <Plus size={15} />
            新規登録
          </button>
        }
      />

      {/* サマリカード */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#e8ecf0]">
          <div className="text-xs text-gray-500 mb-2">今月の不良件数</div>
          <div className="text-2xl font-bold text-gray-900">{totalDefects}<span className="text-base font-normal text-gray-500 ml-1">件</span></div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#e8ecf0]">
          <div className="text-xs text-gray-500 mb-2">平均不良率</div>
          <div className="text-2xl font-bold text-gray-900">{avgRate}<span className="text-base font-normal text-gray-500 ml-1">%</span></div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#e8ecf0]">
          <div className="text-xs text-gray-500 mb-2">最多不良種別</div>
          <div className="text-2xl font-bold text-gray-900 text-base">{topType}</div>
        </div>
      </div>

      {/* グラフ */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* 不良種別PieChart */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#e8ecf0]">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">不良種別内訳</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={true}
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ライン別不良率推移LineChart */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#e8ecf0]">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">ライン別不良率推移</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, 2.5]} />
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="line1" name="ライン1" stroke="#4361ee" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="line2" name="ライン2" stroke="#2a9d5c" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="line3" name="ライン3" stroke="#e07b00" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="line4" name="ライン4" stroke="#e63946" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* テーブル */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e8ecf0]">
        <div className="px-5 py-4 border-b border-[#e8ecf0]">
          <h3 className="text-sm font-semibold text-gray-700">不良発生一覧</h3>
        </div>
        <DataTable columns={columns} data={records} />
      </div>

      {/* 新規登録モーダル */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[480px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8ecf0]">
              <h3 className="text-base font-semibold text-gray-800">不良発生 新規登録</h3>
              <button onClick={() => { setShowModal(false); setErrors({}); setForm(emptyForm); }}>
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">日付 <span className="text-red-500">*</span></label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-[#e8ecf0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4361ee]" />
                {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">ライン <span className="text-red-500">*</span></label>
                <select value={form.lineId} onChange={(e) => setForm({ ...form, lineId: e.target.value })}
                  className="w-full border border-[#e8ecf0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4361ee]">
                  <option value="">選択してください</option>
                  {lines.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
                {errors.lineId && <p className="text-xs text-red-500 mt-1">{errors.lineId}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">製品名 <span className="text-red-500">*</span></label>
                <select value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })}
                  className="w-full border border-[#e8ecf0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4361ee]">
                  <option value="">選択してください</option>
                  {productNames.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                {errors.productName && <p className="text-xs text-red-500 mt-1">{errors.productName}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">不良種別 <span className="text-red-500">*</span></label>
                <select value={form.defectType} onChange={(e) => setForm({ ...form, defectType: e.target.value })}
                  className="w-full border border-[#e8ecf0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4361ee]">
                  <option value="">選択してください</option>
                  {defectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.defectType && <p className="text-xs text-red-500 mt-1">{errors.defectType}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">検査数 <span className="text-red-500">*</span></label>
                  <input type="number" value={form.totalCount} onChange={(e) => setForm({ ...form, totalCount: e.target.value })} min="1"
                    className="w-full border border-[#e8ecf0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4361ee]" />
                  {errors.totalCount && <p className="text-xs text-red-500 mt-1">{errors.totalCount}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">不良数 <span className="text-red-500">*</span></label>
                  <input type="number" value={form.defectCount} onChange={(e) => setForm({ ...form, defectCount: e.target.value })} min="0"
                    className="w-full border border-[#e8ecf0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4361ee]" />
                  {errors.defectCount && <p className="text-xs text-red-500 mt-1">{errors.defectCount}</p>}
                </div>
              </div>
              {/* リアルタイム不良率表示 */}
              {calcRate !== null && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 text-sm text-blue-700">
                  不良率（自動計算）: <strong>{calcRate}%</strong>
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-600 mb-1">備考</label>
                <input type="text" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="w-full border border-[#e8ecf0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4361ee]"
                  placeholder="任意" />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-[#e8ecf0]">
              <button onClick={() => { setShowModal(false); setErrors({}); setForm(emptyForm); }}
                className="px-4 py-2 text-sm border border-[#e8ecf0] rounded-lg hover:bg-gray-50 transition-colors">
                キャンセル
              </button>
              <button onClick={handleSubmit}
                className="px-4 py-2 text-sm bg-[#4361ee] text-white rounded-lg hover:bg-[#3451d1] transition-colors">
                登録
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
