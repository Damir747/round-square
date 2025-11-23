/**
 * Возвращает слово с правильным окончанием для "очко"
 * @param points - количество очков
 */
export function formatPoints(points: number) {
  const lastDigit = points % 10;
  const lastTwoDigits = points % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return "очков";
  }

  switch (lastDigit) {
    case 1:
      return "очко";
    case 2:
    case 3:
    case 4:
      return "очка";
    default:
      return "очков";
  }
}
