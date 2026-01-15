// Function to parse an ISO 8601 date string as a UTC date
export function parseUTCDate(dateString) {
  return new Date(dateString);
}

// Get the start and end dates for a week range.
// Expects the client to send the week boundaries pre-calculated in their timezone.
export function getWeekRange(weekStartString) {
  const start = parseUTCDate(weekStartString);

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 7); // Move to next Sunday

  return { start, end };
}
