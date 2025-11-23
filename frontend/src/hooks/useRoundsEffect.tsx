import { useCallback, useEffect, useState } from "react";
import type { TRound } from "../../../shared/types";

export function useRoundsEffect() {
  const [rounds, setRounds] = useState<TRound[]>([]);
  const [loading, setLoading] = useState(true);

  // функция для загрузки раундов
  const fetchRounds = useCallback(async () => {
    try {
      const meRes = await fetch("http://localhost:3001/me", {
        credentials: "include",
      });
      if (!meRes.ok) throw new Error("Not authenticated");

      const roundsRes = await fetch("http://localhost:3001/rounds", {
        credentials: "include",
      });
      const roundsData: TRound[] = await roundsRes.json();
      const roundsWithDates = roundsData.map((round) => ({
        ...round,
        startAt: new Date(round.startAt),
        endAt: new Date(round.endAt),
      }));

      setRounds(roundsWithDates);
    } catch {
      window.location.href = "/";
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRounds();
  }, [fetchRounds]);

  return { rounds, loading, fetchRounds };
}
