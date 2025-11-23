import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyList from "../components/empty-list";
import Loading from "../components/loading";
import RoundItem from "../components/round-item";
import { useRoundsEffect } from "../hooks/useRoundsEffect";

export default function Rounds() {
  const { rounds, loading, fetchRounds } = useRoundsEffect();
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  // Получаем роль пользователя при монтировании
  useEffect(() => {
    fetch("http://localhost:3001/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUserRole(data.user?.role || null))
      .catch(() => setUserRole(null));
  }, []);

  const handleCreateRound = async () => {
    try {
      const res = await fetch("http://localhost:3001/rounds", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create round");
      const newRound = await res.json();
      fetchRounds?.(); // обновляем список раундов
      navigate(`/round/${newRound.id}`); // переходим на страницу нового раунда
    } catch (err) {
      console.error(err);
      alert("Error creating round");
    }
  };

  return (
    <div>
      <h1>List of Rounds</h1>

      {/* Кнопка для админа */}
      {userRole === "admin" && (
        <button
          onClick={handleCreateRound}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Create Round
        </button>
      )}

      {loading ? (
        <Loading />
      ) : rounds.length === 0 ? (
        <EmptyList message="No rounds yet" />
      ) : (
        <ul>
          {rounds.map((round) => (
            <RoundItem key={round.id} round={round} />
          ))}
        </ul>
      )}
    </div>
  );
}
