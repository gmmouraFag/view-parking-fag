export type Status = "FREE" | "OCCUPIED" | "UNKNOWN";
export interface Point {
  x: number;
  y: number;
}
export interface Spot {
  spotCode: string;
  status: Status;
  sector: string;
  accessible: boolean;
  layoutOrder: number;
  polygon: Point[];
  lastObserved: string;
  lastUpdated: string;
}
export interface Summary {
  total: number;
  free: number;
  occupied: number;
  unknown: number;
  occupancyPercent?: number | null;
}
export interface Snapshot {
  spots: Spot[];
  summary: Summary;
  serverTime: string;
  lastObserved?: string;
  monitoringActive: boolean;
}
export const statusLabel: Record<Status, string> = {
  FREE: "Livre",
  OCCUPIED: "Ocupada",
  UNKNOWN: "Desconhecida",
};
