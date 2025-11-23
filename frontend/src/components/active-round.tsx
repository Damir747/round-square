import { ROUND_STATUS_CONFIG, type TRound } from "../../../shared/types";

type ActiveRoundProps = {
  round: TRound; // здесь round имеет тип TRound
  timer: number; // если нужно
};
export default function ActiveRound({ round, timer }: ActiveRoundProps) {
  const config = ROUND_STATUS_CONFIG[round.status];

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: 16,
        borderRadius: 8,
        marginTop: 20,
      }}
    >
      <h2 style={{ color: config.color }}>{config.text}</h2>

      {config.showTimer && <p>Осталось: {timer}s</p>}

      <p>
        <strong>Мои тапы: </strong> {round.taps ?? 0}
      </p>
      <p>
        <strong>Мои очки: </strong> {round.myPoints ?? 0}
      </p>
    </div>
  );
}
