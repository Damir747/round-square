import type { TRound } from "../../../shared/types";
import { formatPoints } from "../utils/format-points";

export default function FinishedRound({ round }: { round: TRound }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: 16,
        borderRadius: 8,
        marginTop: 20,
      }}
    >
      <h2 style={{ color: "red" }}>Раунд завершён!</h2>

      <p>
        <strong>Победитель:</strong>{" "}
        {round.winner
          ? `${round.winner.username} (${round.winner.points} ${formatPoints(
              round.winner.points
            )})`
          : "Определяется..."}
      </p>

      <p>
        <strong>Мои тапы: </strong> {round.taps ?? 0}
      </p>
      <p>
        <strong>Мои очки: </strong> {round.myPoints ?? 0}
      </p>
    </div>
  );
}
