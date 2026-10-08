import { useEffect, useState } from "react";
import { fetchSnapshot, isSnapshot } from "./api";
import type { Snapshot } from "./types";

const cacheKey = "parking-fag:last-observation:v1";
const configuredInterval = Number(import.meta.env.VITE_POLL_INTERVAL_MS || 500);
const pollInterval =
  Number.isFinite(configuredInterval) &&
  configuredInterval >= 250 &&
  configuredInterval <= 30000
    ? configuredInterval
    : 500;
const retryInterval = 2000;
function readCache(): { data: Snapshot; updated: string } | null {
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
    return cached &&
      isSnapshot(cached.data) &&
      typeof cached.updated === "string"
      ? cached
      : null;
  } catch {
    return null;
  }
}

export function useParking() {
  const [cache] = useState(readCache);
  const [data, setData] = useState<Snapshot | null>(cache?.data || null);
  const [updated, setUpdated] = useState<string | null>(cache?.updated || null);
  const [loading, setLoading] = useState(!cache);
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    let active = true;
    let next: ReturnType<typeof setTimeout>;
    let controller: AbortController;
    async function poll() {
      controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      let delay = pollInterval;
      try {
        const snapshot = await fetchSnapshot(controller.signal);
        if (!active) return;
        const now = new Date().toISOString();
        setData(snapshot);
        setUpdated(now);
        setConnected(true);
        try {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ data: snapshot, updated: now }),
          );
        } catch {
          /* Storage is optional. */
        }
      } catch {
        if (!active) return;
        setConnected(false);
        delay = retryInterval;
      } finally {
        clearTimeout(timeout);
        if (active) {
          setLoading(false);
          next = setTimeout(poll, delay);
        }
      }
    }
    void poll();
    return () => {
      active = false;
      clearTimeout(next);
      controller?.abort();
    };
  }, []);
  return { data, updated, loading, connected };
}
