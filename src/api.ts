import type { Snapshot } from "./types";

export function isSnapshot(value: unknown): value is Snapshot {
  if (!value || typeof value !== "object") return false;
  const data = value as Snapshot;
  return (
    Array.isArray(data.spots) &&
    data.spots.every(
      (s) =>
        typeof s.spotCode === "string" &&
        ["FREE", "OCCUPIED", "UNKNOWN"].includes(s.status) &&
        typeof s.sector === "string" &&
        typeof s.accessible === "boolean" &&
        typeof s.layoutOrder === "number" &&
        Array.isArray(s.polygon) &&
        s.polygon.length >= 3 &&
        s.polygon.every(
          (p) =>
            Number.isFinite(p.x) &&
            Number.isFinite(p.y) &&
            p.x >= 0 &&
            p.x <= 1 &&
            p.y >= 0 &&
            p.y <= 1,
        ),
    ) &&
    !!data.summary &&
    ["total", "free", "occupied", "unknown"].every(
      (key) =>
        Number.isInteger(data.summary[key as keyof typeof data.summary]) &&
        (data.summary[key as keyof typeof data.summary] as number) >= 0,
    ) &&
    data.summary.total === data.spots.length &&
    data.summary.total ===
      data.summary.free + data.summary.occupied + data.summary.unknown &&
    typeof data.monitoringActive === "boolean"
  );
}

export async function fetchSnapshot(signal: AbortSignal): Promise<Snapshot> {
  const response = await fetch(
    `${(import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "")}/api/v1/parking-spots`,
    { signal, cache: "no-store" },
  );
  if (!response.ok) throw new Error("Não foi possível consultar as vagas");
  const data: unknown = await response.json();
  if (!isSnapshot(data)) throw new Error("Resposta inválida");
  return data;
}
