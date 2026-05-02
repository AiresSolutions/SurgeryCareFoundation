const DAY_IN_MS = 24 * 60 * 60 * 1000;

export interface DateRange {
  startDate: string;
  endDate: string;
}

export function getLastNDaysRange(days: number): DateRange {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - (days - 1) * DAY_IN_MS);

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
}
