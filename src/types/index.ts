export type User = {
  id: string;
  name: string;
  employeeNumber: string;
};

export type Line = {
  id: string;
  name: string;
};

export type ProductionRecord = {
  id: string;
  date: string;
  lineId: string;
  lineName: string;
  workerId: string;
  workerName: string;
  productName: string;
  plannedCount: number;
  actualCount: number;
  workHours: number;
  createdAt: string;
};

export type DefectRecord = {
  id: string;
  date: string;
  lineId: string;
  lineName: string;
  productName: string;
  defectType: string;
  defectCount: number;
  totalCount: number;
  defectRate: number;
  note: string;
};

export type LineStoppage = {
  id: string;
  date: string;
  lineId: string;
  lineName: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  reason: string;
  category: "設備故障" | "資材不足" | "品質問題" | "その他";
};

export type OrderData = {
  id: string;
  clientName: string;
  receivedAt: string;
  status: "未変換" | "変換済" | "取込完了";
  itemCount: number;
  fileName: string;
};

// 権限ロール
export type Role = 'admin' | 'general';

// ログインユーザー
export type AuthUser = {
  id: string;
  name: string;
  employeeNumber: string;
  role: Role;
  department: string;
};

// 作業者マスタ
export type WorkerMaster = {
  id: string;
  name: string;
  employeeNumber: string;
  department: string;
  isActive: boolean;
};

// ラインマスタ
export type LineMaster = {
  id: string;
  name: string;
  capacity: number;
  isActive: boolean;
};

// 受発注変換フォーマット設定
export type ColumnMapping = {
  orderNumber: string;   // 注文番号の列名
  productCode: string;   // 品番の列名
  quantity: string;      // 数量の列名
  deliveryDate: string;  // 納期の列名
  clientCode: string;    // 取引先コードの列名
};

// 取引先マスタ
export type ClientMaster = {
  id: string;
  name: string;
  formatType: string;
  columnMapping: ColumnMapping;
  isActive: boolean;
};
