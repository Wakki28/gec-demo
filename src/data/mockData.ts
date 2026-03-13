import type { ProductionRecord, DefectRecord, LineStoppage, OrderData, Line, User, AuthUser, WorkerMaster, LineMaster, ClientMaster } from "../types";

// ライン一覧
export const lines: Line[] = [
  { id: "L1", name: "ライン1" },
  { id: "L2", name: "ライン2" },
  { id: "L3", name: "ライン3" },
  { id: "L4", name: "ライン4" },
];

// 作業者一覧
export const workers: User[] = [
  { id: "EMP001", name: "田中 誠", employeeNumber: "EMP001" },
  { id: "EMP002", name: "鈴木 健太", employeeNumber: "EMP002" },
  { id: "EMP003", name: "山本 直樹", employeeNumber: "EMP003" },
  { id: "EMP004", name: "中村 亮", employeeNumber: "EMP004" },
  { id: "EMP005", name: "佐藤 美咲", employeeNumber: "EMP005" },
  { id: "EMP006", name: "伊藤 拓也", employeeNumber: "EMP006" },
];

// 製品名一覧
export const productNames = [
  "ガス通路部品A",
  "水通路部品B",
  "メカ制御部品C",
  "樹脂加工部品D",
];

// 製造実績モックデータ（直近3ヶ月分 25件）
export const productionRecords: ProductionRecord[] = [
  { id: "PR001", date: "2025-12-05", lineId: "L1", lineName: "ライン1", workerId: "EMP001", workerName: "田中 誠", productName: "ガス通路部品A", plannedCount: 200, actualCount: 210, workHours: 8, createdAt: "2025-12-05T17:00:00" },
  { id: "PR002", date: "2025-12-08", lineId: "L2", lineName: "ライン2", workerId: "EMP002", workerName: "鈴木 健太", productName: "水通路部品B", plannedCount: 180, actualCount: 175, workHours: 8, createdAt: "2025-12-08T17:00:00" },
  { id: "PR003", date: "2025-12-10", lineId: "L3", lineName: "ライン3", workerId: "EMP003", workerName: "山本 直樹", productName: "メカ制御部品C", plannedCount: 150, actualCount: 155, workHours: 7.5, createdAt: "2025-12-10T17:00:00" },
  { id: "PR004", date: "2025-12-12", lineId: "L4", lineName: "ライン4", workerId: "EMP004", workerName: "中村 亮", productName: "樹脂加工部品D", plannedCount: 300, actualCount: 290, workHours: 8, createdAt: "2025-12-12T17:00:00" },
  { id: "PR005", date: "2025-12-15", lineId: "L1", lineName: "ライン1", workerId: "EMP005", workerName: "佐藤 美咲", productName: "ガス通路部品A", plannedCount: 200, actualCount: 205, workHours: 8, createdAt: "2025-12-15T17:00:00" },
  { id: "PR006", date: "2025-12-18", lineId: "L2", lineName: "ライン2", workerId: "EMP006", workerName: "伊藤 拓也", productName: "水通路部品B", plannedCount: 180, actualCount: 160, workHours: 7, createdAt: "2025-12-18T17:00:00" },
  { id: "PR007", date: "2025-12-20", lineId: "L3", lineName: "ライン3", workerId: "EMP001", workerName: "田中 誠", productName: "メカ制御部品C", plannedCount: 150, actualCount: 148, workHours: 8, createdAt: "2025-12-20T17:00:00" },
  { id: "PR008", date: "2025-12-22", lineId: "L4", lineName: "ライン4", workerId: "EMP002", workerName: "鈴木 健太", productName: "樹脂加工部品D", plannedCount: 300, actualCount: 310, workHours: 8.5, createdAt: "2025-12-22T17:00:00" },
  { id: "PR009", date: "2026-01-06", lineId: "L1", lineName: "ライン1", workerId: "EMP003", workerName: "山本 直樹", productName: "ガス通路部品A", plannedCount: 200, actualCount: 198, workHours: 8, createdAt: "2026-01-06T17:00:00" },
  { id: "PR010", date: "2026-01-08", lineId: "L2", lineName: "ライン2", workerId: "EMP004", workerName: "中村 亮", productName: "水通路部品B", plannedCount: 180, actualCount: 185, workHours: 8, createdAt: "2026-01-08T17:00:00" },
  { id: "PR011", date: "2026-01-10", lineId: "L3", lineName: "ライン3", workerId: "EMP005", workerName: "佐藤 美咲", productName: "メカ制御部品C", plannedCount: 150, actualCount: 150, workHours: 8, createdAt: "2026-01-10T17:00:00" },
  { id: "PR012", date: "2026-01-13", lineId: "L4", lineName: "ライン4", workerId: "EMP006", workerName: "伊藤 拓也", productName: "樹脂加工部品D", plannedCount: 300, actualCount: 295, workHours: 8, createdAt: "2026-01-13T17:00:00" },
  { id: "PR013", date: "2026-01-15", lineId: "L1", lineName: "ライン1", workerId: "EMP001", workerName: "田中 誠", productName: "ガス通路部品A", plannedCount: 200, actualCount: 215, workHours: 8.5, createdAt: "2026-01-15T17:00:00" },
  { id: "PR014", date: "2026-01-17", lineId: "L2", lineName: "ライン2", workerId: "EMP002", workerName: "鈴木 健太", productName: "水通路部品B", plannedCount: 180, actualCount: 170, workHours: 7.5, createdAt: "2026-01-17T17:00:00" },
  { id: "PR015", date: "2026-01-20", lineId: "L3", lineName: "ライン3", workerId: "EMP003", workerName: "山本 直樹", productName: "メカ制御部品C", plannedCount: 150, actualCount: 155, workHours: 8, createdAt: "2026-01-20T17:00:00" },
  { id: "PR016", date: "2026-01-22", lineId: "L4", lineName: "ライン4", workerId: "EMP004", workerName: "中村 亮", productName: "樹脂加工部品D", plannedCount: 300, actualCount: 305, workHours: 8, createdAt: "2026-01-22T17:00:00" },
  { id: "PR017", date: "2026-01-25", lineId: "L1", lineName: "ライン1", workerId: "EMP005", workerName: "佐藤 美咲", productName: "ガス通路部品A", plannedCount: 200, actualCount: 192, workHours: 8, createdAt: "2026-01-25T17:00:00" },
  { id: "PR018", date: "2026-02-03", lineId: "L2", lineName: "ライン2", workerId: "EMP006", workerName: "伊藤 拓也", productName: "水通路部品B", plannedCount: 180, actualCount: 178, workHours: 8, createdAt: "2026-02-03T17:00:00" },
  { id: "PR019", date: "2026-02-05", lineId: "L3", lineName: "ライン3", workerId: "EMP001", workerName: "田中 誠", productName: "メカ制御部品C", plannedCount: 150, actualCount: 152, workHours: 8, createdAt: "2026-02-05T17:00:00" },
  { id: "PR020", date: "2026-02-07", lineId: "L4", lineName: "ライン4", workerId: "EMP002", workerName: "鈴木 健太", productName: "樹脂加工部品D", plannedCount: 300, actualCount: 312, workHours: 8.5, createdAt: "2026-02-07T17:00:00" },
  { id: "PR021", date: "2026-02-10", lineId: "L1", lineName: "ライン1", workerId: "EMP003", workerName: "山本 直樹", productName: "ガス通路部品A", plannedCount: 200, actualCount: 200, workHours: 8, createdAt: "2026-02-10T17:00:00" },
  { id: "PR022", date: "2026-02-13", lineId: "L2", lineName: "ライン2", workerId: "EMP004", workerName: "中村 亮", productName: "水通路部品B", plannedCount: 180, actualCount: 182, workHours: 8, createdAt: "2026-02-13T17:00:00" },
  { id: "PR023", date: "2026-02-17", lineId: "L3", lineName: "ライン3", workerId: "EMP005", workerName: "佐藤 美咲", productName: "メカ制御部品C", plannedCount: 150, actualCount: 145, workHours: 7.5, createdAt: "2026-02-17T17:00:00" },
  { id: "PR024", date: "2026-02-20", lineId: "L4", lineName: "ライン4", workerId: "EMP006", workerName: "伊藤 拓也", productName: "樹脂加工部品D", plannedCount: 300, actualCount: 298, workHours: 8, createdAt: "2026-02-20T17:00:00" },
  { id: "PR025", date: "2026-02-24", lineId: "L1", lineName: "ライン1", workerId: "EMP001", workerName: "田中 誠", productName: "ガス通路部品A", plannedCount: 200, actualCount: 208, workHours: 8, createdAt: "2026-02-24T17:00:00" },
];

// 不良発生モックデータ（直近3ヶ月分 18件）
export const defectRecords: DefectRecord[] = [
  { id: "DF001", date: "2025-12-04", lineId: "L1", lineName: "ライン1", productName: "ガス通路部品A", defectType: "寸法不良", defectCount: 2, totalCount: 200, defectRate: 1.0, note: "" },
  { id: "DF002", date: "2025-12-09", lineId: "L2", lineName: "ライン2", productName: "水通路部品B", defectType: "外観不良", defectCount: 3, totalCount: 180, defectRate: 1.67, note: "塗装ムラ" },
  { id: "DF003", date: "2025-12-11", lineId: "L3", lineName: "ライン3", productName: "メカ制御部品C", defectType: "機能不良", defectCount: 1, totalCount: 150, defectRate: 0.67, note: "" },
  { id: "DF004", date: "2025-12-14", lineId: "L4", lineName: "ライン4", productName: "樹脂加工部品D", defectType: "その他", defectCount: 4, totalCount: 300, defectRate: 1.33, note: "バリ発生" },
  { id: "DF005", date: "2025-12-17", lineId: "L1", lineName: "ライン1", productName: "ガス通路部品A", defectType: "寸法不良", defectCount: 1, totalCount: 200, defectRate: 0.5, note: "" },
  { id: "DF006", date: "2025-12-21", lineId: "L2", lineName: "ライン2", productName: "水通路部品B", defectType: "外観不良", defectCount: 2, totalCount: 180, defectRate: 1.11, note: "" },
  { id: "DF007", date: "2026-01-07", lineId: "L3", lineName: "ライン3", productName: "メカ制御部品C", defectType: "寸法不良", defectCount: 3, totalCount: 150, defectRate: 2.0, note: "治具調整必要" },
  { id: "DF008", date: "2026-01-09", lineId: "L4", lineName: "ライン4", productName: "樹脂加工部品D", defectType: "外観不良", defectCount: 2, totalCount: 300, defectRate: 0.67, note: "" },
  { id: "DF009", date: "2026-01-12", lineId: "L1", lineName: "ライン1", productName: "ガス通路部品A", defectType: "機能不良", defectCount: 2, totalCount: 200, defectRate: 1.0, note: "" },
  { id: "DF010", date: "2026-01-16", lineId: "L2", lineName: "ライン2", productName: "水通路部品B", defectType: "その他", defectCount: 1, totalCount: 180, defectRate: 0.56, note: "" },
  { id: "DF011", date: "2026-01-19", lineId: "L3", lineName: "ライン3", productName: "メカ制御部品C", defectType: "外観不良", defectCount: 2, totalCount: 150, defectRate: 1.33, note: "" },
  { id: "DF012", date: "2026-01-23", lineId: "L4", lineName: "ライン4", productName: "樹脂加工部品D", defectType: "寸法不良", defectCount: 3, totalCount: 300, defectRate: 1.0, note: "" },
  { id: "DF013", date: "2026-02-04", lineId: "L1", lineName: "ライン1", productName: "ガス通路部品A", defectType: "外観不良", defectCount: 1, totalCount: 200, defectRate: 0.5, note: "" },
  { id: "DF014", date: "2026-02-06", lineId: "L2", lineName: "ライン2", productName: "水通路部品B", defectType: "機能不良", defectCount: 2, totalCount: 180, defectRate: 1.11, note: "動作確認要" },
  { id: "DF015", date: "2026-02-11", lineId: "L3", lineName: "ライン3", productName: "メカ制御部品C", defectType: "寸法不良", defectCount: 1, totalCount: 150, defectRate: 0.67, note: "" },
  { id: "DF016", date: "2026-02-14", lineId: "L4", lineName: "ライン4", productName: "樹脂加工部品D", defectType: "その他", defectCount: 3, totalCount: 300, defectRate: 1.0, note: "" },
  { id: "DF017", date: "2026-02-18", lineId: "L1", lineName: "ライン1", productName: "ガス通路部品A", defectType: "外観不良", defectCount: 2, totalCount: 200, defectRate: 1.0, note: "" },
  { id: "DF018", date: "2026-02-21", lineId: "L2", lineName: "ライン2", productName: "水通路部品B", defectType: "寸法不良", defectCount: 2, totalCount: 180, defectRate: 1.11, note: "" },
];

// ライン停止モックデータ（直近1ヶ月分 8件）
export const lineStoppages: LineStoppage[] = [
  { id: "LS001", date: "2026-02-03", lineId: "L1", lineName: "ライン1", startTime: "09:15", endTime: "10:30", durationMinutes: 75, reason: "コンベア駆動モーター故障", category: "設備故障" },
  { id: "LS002", date: "2026-02-05", lineId: "L2", lineName: "ライン2", startTime: "13:00", endTime: "13:45", durationMinutes: 45, reason: "部品在庫切れ（水通路部品B用シール材）", category: "資材不足" },
  { id: "LS003", date: "2026-02-07", lineId: "L3", lineName: "ライン3", startTime: "10:30", endTime: "11:00", durationMinutes: 30, reason: "不良品多発による緊急停止", category: "品質問題" },
  { id: "LS004", date: "2026-02-10", lineId: "L4", lineName: "ライン4", startTime: "14:00", endTime: "15:30", durationMinutes: 90, reason: "射出成形機ノズル詰まり", category: "設備故障" },
  { id: "LS005", date: "2026-02-13", lineId: "L1", lineName: "ライン1", startTime: "08:30", endTime: "09:00", durationMinutes: 30, reason: "作業準備不足（工具紛失）", category: "その他" },
  { id: "LS006", date: "2026-02-17", lineId: "L2", lineName: "ライン2", startTime: "11:15", endTime: "12:00", durationMinutes: 45, reason: "検査装置エラー、再キャリブレーション", category: "設備故障" },
  { id: "LS007", date: "2026-02-20", lineId: "L3", lineName: "ライン3", startTime: "15:00", endTime: "15:30", durationMinutes: 30, reason: "原材料（樹脂ペレット）在庫切れ", category: "資材不足" },
  { id: "LS008", date: "2026-02-24", lineId: "L4", lineName: "ライン4", startTime: "10:00", endTime: "11:30", durationMinutes: 90, reason: "寸法不良多発、金型調整", category: "品質問題" },
];

// 受発注データ（6件）
export const orderDataList: OrderData[] = [
  { id: "ORD001", clientName: "株式会社サンプル製作所", receivedAt: "2026-02-20T09:30:00", status: "取込完了", itemCount: 12, fileName: "order_20260220_001.csv" },
  { id: "ORD002", clientName: "テクノパーツ株式会社", receivedAt: "2026-02-22T14:00:00", status: "変換済", itemCount: 8, fileName: "order_20260222_001.xlsx" },
  { id: "ORD003", clientName: "精密工業株式会社", receivedAt: "2026-02-25T10:15:00", status: "未変換", itemCount: 15, fileName: "order_20260225_001.csv" },
  { id: "ORD004", clientName: "株式会社サンプル製作所", receivedAt: "2026-03-01T08:45:00", status: "取込完了", itemCount: 10, fileName: "order_20260301_001.csv" },
  { id: "ORD005", clientName: "東海部品株式会社", receivedAt: "2026-03-05T13:30:00", status: "変換済", itemCount: 6, fileName: "order_20260305_001.xlsx" },
  { id: "ORD006", clientName: "テクノパーツ株式会社", receivedAt: "2026-03-10T09:00:00", status: "未変換", itemCount: 20, fileName: "order_20260310_001.csv" },
];

// ダッシュボード用月別生産データ（直近6ヶ月）
export const monthlyProductionData = [
  { month: "2025-09", planned: 3800, actual: 3750 },
  { month: "2025-10", planned: 4000, actual: 4050 },
  { month: "2025-11", planned: 4200, actual: 4100 },
  { month: "2025-12", planned: 4300, actual: 4280 },
  { month: "2026-01", planned: 4100, actual: 4150 },
  { month: "2026-02", planned: 4200, actual: 4220 },
];

// ダッシュボード用不良率推移データ（直近6ヶ月・ライン別）
export const monthlyDefectRateData = [
  { month: "2025-09", line1: 0.9, line2: 1.1, line3: 0.8, line4: 1.2 },
  { month: "2025-10", line1: 1.0, line2: 0.9, line3: 1.0, line4: 1.0 },
  { month: "2025-11", line1: 0.8, line2: 1.2, line3: 0.9, line4: 0.8 },
  { month: "2025-12", line1: 0.7, line2: 1.0, line3: 0.7, line4: 1.1 },
  { month: "2026-01", line1: 0.9, line2: 0.8, line3: 1.3, line4: 0.8 },
  { month: "2026-02", line1: 0.7, line2: 1.0, line3: 0.7, line4: 1.0 },
];

// ログインユーザー一覧
export const mockUsers: AuthUser[] = [
  {
    id: 'u001',
    name: '田中 誠',
    employeeNumber: 'EMP001',
    role: 'admin',
    department: '企画管理室 情報システムチーム',
  },
  {
    id: 'u002',
    name: '鈴木 健太',
    employeeNumber: 'EMP002',
    role: 'general',
    department: '製造部 ライン1',
  },
  {
    id: 'u003',
    name: '山本 直樹',
    employeeNumber: 'EMP003',
    role: 'general',
    department: '製造部 ライン2',
  },
];

// 作業者マスタ
export const mockWorkerMasters: WorkerMaster[] = [
  { id: 'w001', name: '田中 誠',   employeeNumber: 'EMP001', department: '企画管理室', isActive: true },
  { id: 'w002', name: '鈴木 健太', employeeNumber: 'EMP002', department: '製造部',     isActive: true },
  { id: 'w003', name: '山本 直樹', employeeNumber: 'EMP003', department: '製造部',     isActive: true },
  { id: 'w004', name: '中村 亮',   employeeNumber: 'EMP004', department: '製造部',     isActive: true },
  { id: 'w005', name: '佐藤 美咲', employeeNumber: 'EMP005', department: '品質管理部', isActive: true },
  { id: 'w006', name: '伊藤 拓也', employeeNumber: 'EMP006', department: '製造部',     isActive: false },
];

// ラインマスタ
export const mockLineMasters: LineMaster[] = [
  { id: 'l001', name: 'ライン1', capacity: 500, isActive: true },
  { id: 'l002', name: 'ライン2', capacity: 450, isActive: true },
  { id: 'l003', name: 'ライン3', capacity: 500, isActive: true },
  { id: 'l004', name: 'ライン4', capacity: 400, isActive: false },
];

// 取引先マスタ（受発注変換フォーマット付き）
export const mockClientMasters: ClientMaster[] = [
  {
    id: 'c001',
    name: 'ノーリツ株式会社',
    formatType: 'CSV形式A',
    isActive: true,
    columnMapping: {
      orderNumber: '注文番号',
      productCode: '品番',
      quantity: '数量',
      deliveryDate: '納期',
      clientCode: '得意先コード',
    },
  },
  {
    id: 'c002',
    name: '株式会社ABC商事',
    formatType: 'CSV形式B',
    isActive: true,
    columnMapping: {
      orderNumber: 'ORDER_NO',
      productCode: 'ITEM_CODE',
      quantity: 'QTY',
      deliveryDate: 'DELIVERY',
      clientCode: 'CLIENT_CD',
    },
  },
  {
    id: 'c003',
    name: '山田製作所',
    formatType: 'CSV形式C',
    isActive: true,
    columnMapping: {
      orderNumber: '受注No',
      productCode: '製品コード',
      quantity: '発注数',
      deliveryDate: '希望納期',
      clientCode: '顧客番号',
    },
  },
];
