// Get the start of the week (Sunday) for a given date
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 (Sun) to 6 (Sat)
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Get the start and end dates for the week of a given date
export function getWeekRange(date: Date = new Date()) {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return { start, end };
}

// Format date for API calls
export function formatDateForAPI(date: Date): string {
  return date.toISOString();
}
