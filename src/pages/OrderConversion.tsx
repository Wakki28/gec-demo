// 受発注変換ページ（3ステップUI）
import { useState } from "react";
import { Upload, Download, CheckCircle, ChevronRight } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import StatusBadge from "../components/ui/StatusBadge";
import DataTable from "../components/ui/DataTable";
import { orderDataList } from "../data/mockData";
import type { OrderData } from "../types";

// ステータスバッジvariant
function getOrderVariant(status: OrderData["status"]): "success" | "warning" | "default" {
  if (status === "取込完了") return "success";
  if (status === "変換済") return "warning";
  return "default";
}

// モック：変換前データ（先頭5件）
const previewBefore = [
  { orderNo: "PO-2026-001", itemCode: "GAS-A-001", qty: 100, unit: "個", deliveryDate: "2026-03-20" },
  { orderNo: "PO-2026-001", itemCode: "GAS-A-002", qty: 50, unit: "個", deliveryDate: "2026-03-20" },
  { orderNo: "PO-2026-001", itemCode: "WAT-B-001", qty: 200, unit: "個", deliveryDate: "2026-03-25" },
  { orderNo: "PO-2026-001", itemCode: "MEC-C-001", qty: 80, unit: "個", deliveryDate: "2026-03-25" },
  { orderNo: "PO-2026-001", itemCode: "RES-D-001", qty: 150, unit: "個", deliveryDate: "2026-03-28" },
];

// モック：変換後データ（mcframe形式）
const previewAfter = [
  { mcOrderNo: "MCF-2026-0001", mcItemCode: "MC-GAS-A-001", mcQty: 100, mcUnit: "EA", mcDueDate: "20260320", mcStatus: "01" },
  { mcOrderNo: "MCF-2026-0001", mcItemCode: "MC-GAS-A-002", mcQty: 50, mcUnit: "EA", mcDueDate: "20260320", mcStatus: "01" },
  { mcOrderNo: "MCF-2026-0001", mcItemCode: "MC-WAT-B-001", mcQty: 200, mcUnit: "EA", mcDueDate: "20260325", mcStatus: "01" },
  { mcOrderNo: "MCF-2026-0001", mcItemCode: "MC-MEC-C-001", mcQty: 80, mcUnit: "EA", mcDueDate: "20260325", mcStatus: "01" },
  { mcOrderNo: "MCF-2026-0001", mcItemCode: "MC-RES-D-001", mcQty: 150, mcUnit: "EA", mcDueDate: "20260328", mcStatus: "01" },
];

// CSVダウンロード
function downloadConvertedCsv() {
  const header = "mcframe受注番号,品目コード,数量,単位,納期,ステータス";
  const rows = previewAfter.map((r) =>
    `${r.mcOrderNo},${r.mcItemCode},${r.mcQty},${r.mcUnit},${r.mcDueDate},${r.mcStatus}`
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mcframe_converted.csv";
  a.click();
  URL.revokeObjectURL(url);
}

type StepProps = {
  number: number;
  label: string;
  active: boolean;
  done: boolean;
};

function StepIndicator({ number, label, active, done }: StepProps) {
  return (
    <div className={`flex items-center gap-2 ${active ? "text-[#4361ee]" : done ? "text-[#2a9d5c]" : "text-gray-400"}`}>
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
          done
            ? "bg-[#2a9d5c] border-[#2a9d5c] text-white"
            : active
            ? "bg-[#4361ee] border-[#4361ee] text-white"
            : "bg-white border-gray-300 text-gray-400"
        }`}
      >
        {done ? <CheckCircle size={14} /> : number}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export default function OrderConversion() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [uploaded, setUploaded] = useState(false);

  // Step1: ファイル選択（モック）
  function handleUpload() {
    setUploaded(true);
  }

  // Step2: 変換実行
  function handleConvert() {
    setStep(3);
  }

  const historyColumns = [
    { key: "receivedAt", header: "受信日時", render: (r: OrderData) => r.receivedAt.replace("T", " ").slice(0, 16) },
    { key: "client", header: "取引先名", render: (r: OrderData) => r.clientName },
    { key: "file", header: "ファイル名", render: (r: OrderData) => r.fileName },
    { key: "count", header: "件数", render: (r: OrderData) => `${r.itemCount}件` },
    {
      key: "status",
      header: "ステータス",
      render: (r: OrderData) => <StatusBadge label={r.status} variant={getOrderVariant(r.status)} />,
    },
  ];

  return (
    <div>
      <PageHeader title="受発注変換" />

      {/* ステップインジケーター */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-[#e8ecf0] mb-6">
        <div className="flex items-center gap-3">
          <StepIndicator number={1} label="ファイルアップロード" active={step === 1} done={step > 1} />
          <ChevronRight size={16} className="text-gray-300" />
          <StepIndicator number={2} label="プレビュー確認" active={step === 2} done={step > 2} />
          <ChevronRight size={16} className="text-gray-300" />
          <StepIndicator number={3} label="完了" active={step === 3} done={false} />
        </div>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e8ecf0] mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">ファイルアップロード</h3>
          {!uploaded ? (
            <div
              onClick={handleUpload}
              className="border-2 border-dashed border-[#c7d0f5] rounded-xl p-12 flex flex-col items-center gap-3 cursor-pointer hover:bg-[#f0f3fd] transition-colors"
            >
              <Upload size={32} className="text-[#4361ee]" />
              <p className="text-sm text-gray-500">クリックしてファイルを選択</p>
              <p className="text-xs text-gray-400">.csv / .xlsx 対応</p>
            </div>
          ) : (
            <div>
              <div className="border border-[#e8ecf0] rounded-lg p-4 mb-4 flex items-center gap-3 bg-green-50">
                <CheckCircle size={18} className="text-[#2a9d5c]" />
                <div>
                  <div className="text-sm font-medium text-gray-800">order_20260310_001.csv</div>
                  <div className="text-xs text-gray-500">テクノパーツ株式会社 / 20件</div>
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2 text-sm bg-[#4361ee] text-white rounded-lg hover:bg-[#3451d1] transition-colors"
              >
                次へ：プレビュー確認
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e8ecf0] mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">プレビュー確認</h3>
          <p className="text-xs text-gray-500 mb-3">変換前データ（先頭5件）</p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-[#e8ecf0]">
                  {["発注番号", "品目コード", "数量", "単位", "納期"].map((h) => (
                    <th key={h} className="text-left px-3 py-2 text-gray-500 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewBefore.map((r, i) => (
                  <tr key={i} className="border-b border-[#e8ecf0]">
                    <td className="px-3 py-2">{r.orderNo}</td>
                    <td className="px-3 py-2">{r.itemCode}</td>
                    <td className="px-3 py-2">{r.qty}</td>
                    <td className="px-3 py-2">{r.unit}</td>
                    <td className="px-3 py-2">{r.deliveryDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 mb-3">変換後データ（mcframe形式・先頭5件）</p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-blue-50 border-b border-[#e8ecf0]">
                  {["受注番号(MC)", "品目コード(MC)", "数量", "単位", "納期", "ステータス"].map((h) => (
                    <th key={h} className="text-left px-3 py-2 text-[#4361ee] font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewAfter.map((r, i) => (
                  <tr key={i} className="border-b border-[#e8ecf0]">
                    <td className="px-3 py-2">{r.mcOrderNo}</td>
                    <td className="px-3 py-2">{r.mcItemCode}</td>
                    <td className="px-3 py-2">{r.mcQty}</td>
                    <td className="px-3 py-2">{r.mcUnit}</td>
                    <td className="px-3 py-2">{r.mcDueDate}</td>
                    <td className="px-3 py-2">{r.mcStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-sm border border-[#e8ecf0] rounded-lg hover:bg-gray-50 transition-colors"
            >
              戻る
            </button>
            <button
              onClick={handleConvert}
              className="px-5 py-2 text-sm bg-[#4361ee] text-white rounded-lg hover:bg-[#3451d1] transition-colors"
            >
              変換実行
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-[#e8ecf0] mb-6 text-center">
          <CheckCircle size={48} className="text-[#2a9d5c] mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">変換が完了しました</h3>
          <p className="text-sm text-gray-500 mb-6">20件のデータをmcframe形式に変換しました。</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={downloadConvertedCsv}
              className="flex items-center gap-1.5 px-5 py-2 text-sm bg-[#4361ee] text-white rounded-lg hover:bg-[#3451d1] transition-colors"
            >
              <Download size={15} />
              CSVダウンロード
            </button>
            <button
              onClick={() => { setStep(1); setUploaded(false); }}
              className="px-4 py-2 text-sm border border-[#e8ecf0] rounded-lg hover:bg-gray-50 transition-colors"
            >
              新しいファイルを変換
            </button>
          </div>
        </div>
      )}

      {/* 変換履歴テーブル */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e8ecf0]">
        <div className="px-5 py-4 border-b border-[#e8ecf0]">
          <h3 className="text-sm font-semibold text-gray-700">変換履歴</h3>
        </div>
        <DataTable columns={historyColumns} data={orderDataList} />
      </div>
    </div>
  );
}
