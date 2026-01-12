// Set the time of the date to 00:00:00.000 to normalize it
export function normalizeDate(dateString) {
  const d = new Date(dateString)
  d.setHours(0, 0, 0, 0)
  return d
}

// Get the start of the week (Sunday) for a given date
export function normalizeWeekStart(dateString) {
  const d = new Date(dateString)
  const day = d.getDay() // 0 (Sun) to 6 (Sat)
  d.setDate(d.getDate() - day)
  d.setHours(0, 0, 0, 0)
  return d
}

// Get the start and end dates for the week of a given date
export function getWeekRange(dateString) {
  const inputDate = normalizeDate(dateString)
  const start = normalizeWeekStart(inputDate)

  const end = new Date(start)
  end.setDate(end.getDate() + 7)

  return { start, end }
}
