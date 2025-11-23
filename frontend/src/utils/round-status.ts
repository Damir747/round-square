export type RoundStatus = {
  color: string;
  text: string;
};

export function getRoundStatus(startAt: Date, endAt: Date): RoundStatus {
  const now = new Date();

  if (now < startAt) return { color: "gray", text: "Not started yet" };
  if (now > endAt) return { color: "red", text: "Finished" };
  return { color: "green", text: "Active" };
}
