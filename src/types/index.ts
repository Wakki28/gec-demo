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
