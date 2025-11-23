import { Link } from "react-router-dom";
import type { TRound } from "../../../shared/types";
import { getRoundStatus } from "../utils/round-status";

type RoundItemProps = {
  round: TRound;
};

export default function RoundItem({ round }: RoundItemProps) {
  const { color, text } = getRoundStatus(round.startAt, round.endAt);

  return (
    <li style={{ color }} title={text}>
      <Link to={`/round/${round.id}`}>
        {round.name} | {new Date(round.startAt).toLocaleString()} -{" "}
        {new Date(round.endAt).toLocaleString()}
      </Link>
    </li>
  );
}
