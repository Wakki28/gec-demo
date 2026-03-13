// ライン停止ページ
import { useState } from "react";
import { Plus, X } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import PageHeader from "../components/ui/PageHeader";
import StatusBadge from "../components/ui/StatusBadge";
import DataTable from "../components/ui/DataTable";
import { lineStoppages as initialStoppages, lines } from "../data/mockData";
import type { LineStoppage } from "../types";

const categories: LineStoppage["category"][] = ["設備故障", "資材不足", "品質問題", "その他"];

// カテゴリ別バッジvariant
function getCategoryVariant(cat: LineStoppage["category"]): "danger" | "warning" | "info" | "default" {
  if (cat === "設備故障") return "danger";
  if (cat === "資材不足") return "warning";
  if (cat === "品質問題") return "info";
  return "default";
}

// 時刻差分（分）計算
function calcDuration(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}

// ライン別稼働率計算（今月稼働時間480分/日×稼働日数想定）
function buildLineOperationData(stoppages: LineStoppage[]) {
  const workMinutesPerLine = 480 * 20; // 8h × 20日
  return lines.map((line) => {
    const totalStop = stoppages
      .filter((s) => s.lineId === line.id)
      .reduce((sum, s) => sum + s.durationMinutes, 0);
    const rate = parseFloat((((workMinutesPerLine - totalStop) / workMinutesPerLine) * 100).toFixed(1));
    return { name: line.name, rate };
  });
}

const emptyForm = {
  date: "",
  lineId: "",
  startTime: "",
  endTime: "",
  category: "" as LineStoppage["category"] | "",
  reason: "",
};

type FormData = typeof emptyForm;
type FormErrors = Partial<Record<keyof FormData, string>>;

export default function LineStoppagePage() {
  const [stoppages, setStoppages] = useState<LineStoppage[]>(initialStoppages);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  // サマリ計算
  const stopCount = stoppages.length;
  const totalMinutes = stoppages.reduce((s, r) => s + r.durationMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const workMinutesPerLine = 480 * 20;
  const allWork = workMinutesPerLine * 4;
  const operationRate = (((allWork - totalMinutes) / allWork) * 100).toFixed(1);

  // リアルタイム停止時間計算
  const calcDur =
    form.startTime && form.endTime ? calcDuration(form.startTime, form.endTime) : null;

  const lineOpData = buildLineOperationData(stoppages);

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!form.date) errs.date = "日付は必須です";
    if (!form.lineId) errs.lineId = "ラインは必須です";
    if (!form.startTime) errs.startTime = "開始時刻は必須です";
    if (!form.endTime) errs.endTime = "終了時刻は必須です";
    if (form.startTime && form.endTime && calcDuration(form.startTime, form.endTime) <= 0)
      errs.endTime = "終了時刻は開始時刻より後にしてください";
    if (!form.category) errs.category = "分類は必須です";
    if (!form.reason) errs.reason = "停止理由は必須です";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const lineData = lines.find((l) => l.id === form.lineId)!;
    const duration = calcDuration(form.startTime, form.endTime);
    const newRecord: LineStoppage = {
      id: `LS${String(stoppages.length + 1).padStart(3, "0")}`,
      date: form.date,
      lineId: lineData.id,
      lineName: lineData.name,
      startTime: form.startTime,
      endTime: form.endTime,
      durationMinutes: duration,
      reason: form.reason,
      category: form.category as LineStoppage["category"],
    };
    setStoppages([newRecord, ...stoppages]);
    setShowModal(false);
    setForm(emptyForm);
    setErrors({});
  }

  const columns = [
    { key: "date", header: "日付", render: (r: LineStoppage) => r.date },
    { key: "line", header: "ライン", render: (r: LineStoppage) => r.lineName },
    { key: "start", header: "開始時刻", render: (r: LineStoppage) => r.startTime },
    { key: "end", header: "終了時刻", render: (r: LineStoppage) => r.endTime },
    { key: "duration", header: "停止時間（分）", render: (r: LineStoppage) => `${r.durationMinutes}分` },
    {
      key: "category",
      header: "分類",
      render: (r: LineStoppage) => (
        <StatusBadge label={r.category} variant={getCategoryVariant(r.category)} />
      ),
    },
    { key: "reason", header: "停止理由", render: (r: LineStoppage) => r.reason },
  ];

  return (
    <div>
      <PageHeader
        title="ライン停止"
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
          <div className="text-xs text-gray-500 mb-2">今月の停止件数</div>
          <div className="text-2xl font-bold text-gray-900">{stopCount}<span className="text-base font-normal text-gray-500 ml-1">件</span></div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#e8ecf0]">
          <div className="text-xs text-gray-500 mb-2">累計停止時間</div>
          <div className="text-2xl font-bold text-gray-900">{totalHours}<span className="text-base font-normal text-gray-500 ml-1">時間</span></div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#e8ecf0]">
          <div className="text-xs text-gray-500 mb-2">稼働率</div>
          <div className="text-2xl font-bold text-gray-900">{operationRate}<span className="text-base font-normal text-gray-500 ml-1">%</span></div>
        </div>
      </div>

      {/* ライン別稼働率横向きBarChart */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-[#e8ecf0] mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">ライン別稼働率</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={lineOpData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf0" horizontal={false} />
            <XAxis type="number" domain={[90, 100]} tick={{ fontSize: 11 }} unit="%" />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={55} />
            <Tooltip formatter={(v: number) => `${v}%`} />
            <Bar dataKey="rate" name="稼働率" radius={[0, 4, 4, 0]}>
              {lineOpData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.rate >= 95 ? "#2a9d5c" : entry.rate >= 92 ? "#e07b00" : "#e63946"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* テーブル */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e8ecf0]">
        <div className="px-5 py-4 border-b border-[#e8ecf0]">
          <h3 className="text-sm font-semibold text-gray-700">ライン停止一覧</h3>
        </div>
        <DataTable columns={columns} data={stoppages} />
      </div>

      {/* 新規登録モーダル */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[480px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8ecf0]">
              <h3 className="text-base font-semibold text-gray-800">ライン停止 新規登録</h3>
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">開始時刻 <span className="text-red-500">*</span></label>
                  <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full border border-[#e8ecf0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4361ee]" />
                  {errors.startTime && <p className="text-xs text-red-500 mt-1">{errors.startTime}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">終了時刻 <span className="text-red-500">*</span></label>
                  <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="w-full border border-[#e8ecf0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4361ee]" />
                  {errors.endTime && <p className="text-xs text-red-500 mt-1">{errors.endTime}</p>}
                </div>
              </div>
              {/* リアルタイム停止時間表示 */}
              {calcDur !== null && calcDur > 0 && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 text-sm text-blue-700">
                  停止時間（自動計算）: <strong>{calcDur}分</strong>
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-600 mb-1">分類 <span className="text-red-500">*</span></label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as LineStoppage["category"] })}
                  className="w-full border border-[#e8ecf0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4361ee]">
                  <option value="">選択してください</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">停止理由 <span className="text-red-500">*</span></label>
                <input type="text" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="w-full border border-[#e8ecf0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4361ee]"
                  placeholder="停止理由を入力" />
                {errors.reason && <p className="text-xs text-red-500 mt-1">{errors.reason}</p>}
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
