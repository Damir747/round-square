import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ROUND_STATUS, type TRound } from "../../../shared/types";
import ActiveRound from "../components/active-round";
import FinishedRound from "../components/finished-round";
import Goose from "../components/goose";
import Loading from "../components/loading";

export default function RoundPage() {
  const { id } = useParams<{ id: string }>();
  const [round, setRound] = useState<TRound | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRoundWithAuth = async () => {
    try {
      // Проверяем текущего пользователя
      const meRes = await fetch("http://localhost:3001/me", {
        credentials: "include",
      });
      if (!meRes.ok) throw new Error("Not authenticated");

      // Получаем раунд
      const res = await fetch(`http://localhost:3001/rounds/${id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Round fetch failed");

      const data = await res.json();
      setRound(data);
    } catch (err) {
      console.error(err);
      // редирект на логин
      window.location.href = "/";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoundWithAuth();
  }, [id]);

  useEffect(() => {
    if (!round) return;

    const interval = setInterval(() => {
      setRound((prev) => {
        if (!prev) return null;

        if (prev.timeLeft > 0) {
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        } else {
          fetchRoundWithAuth();
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [round]);

  const handleTap = async () => {
    if (!round || round.status !== ROUND_STATUS.ACTIVE) return;

    try {
      const res = await fetch(`http://localhost:3001/rounds/${id}/tap`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      if (data.ok) {
        setRound((prev) =>
          prev
            ? {
                ...prev,
                myPoints: data.userPoints,
                taps: data.taps,
                timeLeft: data.timeLeft,
              }
            : prev
        );
      }
    } catch (err) {
      console.error("Tap error:", err);
    }
  };

  if (loading) return <Loading />;
  if (!round) return <div>Round not found</div>;

  return (
    <div>
      <Link to="/rounds" style={{ display: "inline-block", marginBottom: 16 }}>
        ← Вернуться к списку раундов
      </Link>

      <h1>{round.name}</h1>

      <Goose onClick={handleTap} />

      <p>Статус: {round.status}</p>

      {round.status === ROUND_STATUS.ACTIVE && (
        <ActiveRound round={round} timer={round.timeLeft} />
      )}
      {round.status === ROUND_STATUS.NOT_STARTED && (
        <ActiveRound round={round} timer={round.timeLeft} />
      )}
      {round.status === ROUND_STATUS.FINISHED && (
        <FinishedRound round={round} />
      )}
    </div>
  );
}
