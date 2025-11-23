export const ROUND_STATUS = {
  NOT_STARTED: "not_started",
  ACTIVE: "active",
  FINISHED: "finished",
} as const;

export type TStatus = (typeof ROUND_STATUS)[keyof typeof ROUND_STATUS];

export type TRound = {
  id: number;
  name: string;
  startAt: Date;
  endAt: Date;
  taps: number;
  points: number;
  status: TStatus;
  winner?: {
    username: string;
    points: number;
  } | null;
  timeLeft: number;
  myPoints?: number;
};

export const ROUND_STATUS_CONFIG: Record<
  TStatus,
  { text: string; color: string; showTimer: boolean }
> = {
  [ROUND_STATUS.NOT_STARTED]: {
    text: "Раунд скоро начнётся!",
    color: "#888",
    showTimer: true,
  },
  [ROUND_STATUS.ACTIVE]: {
    text: "Раунд активен!",
    color: "green",
    showTimer: true,
  },
  [ROUND_STATUS.FINISHED]: {
    text: "Раунд завершён!",
    color: "red",
    showTimer: false,
  },
};
