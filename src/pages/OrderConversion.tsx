// 受発注変換ページ（3ステップUI）
import { useState } from "react";
import { Upload, Download, CheckCircle, ChevronRight } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import StatusBadge from "../components/ui/StatusBadge";
import DataTable from "../components/ui/DataTable";
import { orderDataList, mockClientMasters } from "../data/mockData";
import type { OrderData, ClientMaster } from "../types";

// ステータスバッジvariant
function getOrderVariant(status: OrderData["status"]): "success" | "warning" | "default" {
  if (status === "取込完了") return "success";
  if (status === "変換済") return "warning";
  return "default";
}

// モック：変換前データ行の型
type PreviewBeforeRow = {
  col1: string;
  col2: string;
  col3: string;
  col4: string;
  col5: string;
};

// モック：変換後データ行の型
type PreviewAfterRow = {
  orderNumber: string;
  productCode: string;
  quantity: string;
  deliveryDate: string;
  clientCode: string;
};

// 取引先に応じた変換前プレビューデータを生成（列名は clientMapping に従う）
function buildPreviewBefore(client: ClientMaster): PreviewBeforeRow[] {
  const m = client.columnMapping;
  // ダミーデータ（列名はマッピングから取得）
  const dummyValues = [
    ['PO-2026-001', 'GAS-A-001', '100', '2026-03-20', 'CL001'],
    ['PO-2026-001', 'GAS-A-002', '50',  '2026-03-20', 'CL001'],
    ['PO-2026-001', 'WAT-B-001', '200', '2026-03-25', 'CL001'],
    ['PO-2026-001', 'MEC-C-001', '80',  '2026-03-25', 'CL001'],
    ['PO-2026-001', 'RES-D-001', '150', '2026-03-28', 'CL001'],
  ];
  // colMapping を使ったヘッダーをキーに保持
  void m; // 参照のため
  return dummyValues.map(([c1, c2, c3, c4, c5]) => ({
    col1: c1, col2: c2, col3: c3, col4: c4, col5: c5,
  }));
}

// 変換後プレビューデータ（固定mcframe形式）
const previewAfterFixed: PreviewAfterRow[] = [
  { orderNumber: 'MCF-2026-0001', productCode: 'MC-GAS-A-001', quantity: '100', deliveryDate: '20260320', clientCode: 'MCL001' },
  { orderNumber: 'MCF-2026-0001', productCode: 'MC-GAS-A-002', quantity: '50',  deliveryDate: '20260320', clientCode: 'MCL001' },
  { orderNumber: 'MCF-2026-0001', productCode: 'MC-WAT-B-001', quantity: '200', deliveryDate: '20260325', clientCode: 'MCL001' },
  { orderNumber: 'MCF-2026-0001', productCode: 'MC-MEC-C-001', quantity: '80',  deliveryDate: '20260325', clientCode: 'MCL001' },
  { orderNumber: 'MCF-2026-0001', productCode: 'MC-RES-D-001', quantity: '150', deliveryDate: '20260328', clientCode: 'MCL001' },
];

// 有効な取引先のみ
const activeClients = mockClientMasters.filter((c) => c.isActive);

// CSVダウンロード
function downloadConvertedCsv() {
  const header = "注文番号,品番,数量,納期,得意先コード";
  const rows = previewAfterFixed.map((r) =>
    `${r.orderNumber},${r.productCode},${r.quantity},${r.deliveryDate},${r.clientCode}`
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
  const [selectedClientId, setSelectedClientId] = useState<string>('');

  const selectedClient = activeClients.find((c) => c.id === selectedClientId) ?? null;

  // Step1: ファイル選択（モック）
  function handleUpload() {
    setUploaded(true);
  }

  // Step2: 変換実行
  function handleConvert() {
    setStep(3);
  }

  // Step1リセット
  function resetStep1() {
    setStep(1);
    setUploaded(false);
    setSelectedClientId('');
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

          {/* 取引先選択 */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">取引先を選択</label>
            <select
              value={selectedClientId}
              onChange={(e) => { setSelectedClientId(e.target.value); setUploaded(false); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#4361ee] focus:ring-2 focus:ring-[#4361ee]/20 transition-all w-72"
            >
              <option value="">-- 取引先を選択してください --</option>
              {activeClients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* 選択した取引先のフォーマット情報 */}
          {selectedClient && (
            <div className="mb-4 p-4 bg-[#f0f3fd] rounded-lg border border-[#c7d0f5]">
              <p className="text-xs font-semibold text-[#4361ee] mb-2">フォーマット設定：{selectedClient.formatType}</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                {(
                  [
                    ['注文番号', selectedClient.columnMapping.orderNumber],
                    ['品番',     selectedClient.columnMapping.productCode],
                    ['数量',     selectedClient.columnMapping.quantity],
                    ['納期',     selectedClient.columnMapping.deliveryDate],
                    ['取引先コード', selectedClient.columnMapping.clientCode],
                  ] as [string, string][]
                ).map(([label, col]) => (
                  <div key={label} className="flex gap-1 text-xs text-gray-600">
                    <span className="text-gray-400 w-24 shrink-0">{label}：</span>
                    <span className="font-medium text-gray-700">{col}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ファイルアップロードエリア */}
          {selectedClientId && (
            <>
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
                      <div className="text-xs text-gray-500">{selectedClient?.name} / 20件</div>
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
            </>
          )}
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && selectedClient && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e8ecf0] mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">プレビュー確認</h3>

          {/* 変換ルール説明 */}
          <div className="mb-5 p-4 bg-[#f0f3fd] rounded-lg border border-[#c7d0f5]">
            <p className="text-xs font-semibold text-[#4361ee] mb-2">変換ルール（{selectedClient.name} / {selectedClient.formatType}）</p>
            <div className="grid grid-cols-1 gap-1">
              {(
                [
                  [selectedClient.columnMapping.orderNumber,  '注文番号'],
                  [selectedClient.columnMapping.productCode,  '品番'],
                  [selectedClient.columnMapping.quantity,     '数量'],
                  [selectedClient.columnMapping.deliveryDate, '納期'],
                  [selectedClient.columnMapping.clientCode,   '得意先コード'],
                ] as [string, string][]
              ).map(([from, to]) => (
                <p key={to} className="text-xs text-gray-600">
                  <span className="font-medium text-gray-800">{from}</span>
                  <span className="mx-2 text-gray-400">→</span>
                  <span className="font-medium text-[#4361ee]">{to}</span>
                  <span className="text-gray-400"> に変換</span>
                </p>
              ))}
            </div>
          </div>

          {/* 変換前テーブル */}
          <p className="text-xs text-gray-500 mb-3">変換前データ（先頭5件）</p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-[#e8ecf0]">
                  {[
                    selectedClient.columnMapping.orderNumber,
                    selectedClient.columnMapping.productCode,
                    selectedClient.columnMapping.quantity,
                    selectedClient.columnMapping.deliveryDate,
                    selectedClient.columnMapping.clientCode,
                  ].map((h) => (
                    <th key={h} className="text-left px-3 py-2 text-gray-500 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {buildPreviewBefore(selectedClient).map((r, i) => (
                  <tr key={i} className="border-b border-[#e8ecf0]">
                    <td className="px-3 py-2">{r.col1}</td>
                    <td className="px-3 py-2">{r.col2}</td>
                    <td className="px-3 py-2">{r.col3}</td>
                    <td className="px-3 py-2">{r.col4}</td>
                    <td className="px-3 py-2">{r.col5}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 変換後テーブル（mcframe固定フォーマット） */}
          <p className="text-xs text-gray-500 mb-3">変換後データ（mcframe取込用・先頭5件）</p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-blue-50 border-b border-[#e8ecf0]">
                  {["注文番号", "品番", "数量", "納期", "得意先コード"].map((h) => (
                    <th key={h} className="text-left px-3 py-2 text-[#4361ee] font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewAfterFixed.map((r, i) => (
                  <tr key={i} className="border-b border-[#e8ecf0]">
                    <td className="px-3 py-2">{r.orderNumber}</td>
                    <td className="px-3 py-2">{r.productCode}</td>
                    <td className="px-3 py-2">{r.quantity}</td>
                    <td className="px-3 py-2">{r.deliveryDate}</td>
                    <td className="px-3 py-2">{r.clientCode}</td>
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
              onClick={resetStep1}
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
