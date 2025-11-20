export const normalizeKhmerDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date'
  }

  const hours = dateObj.getHours()
  const minutes = dateObj.getMinutes()
  const day = dateObj.getDate().toString().padStart(2, '0')
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const year = dateObj.getFullYear()

  // Convert to 12-hour format
  const hour12 = hours % 12 || 12
  const minutesStr = minutes.toString().padStart(2, '0')

  // Determine Khmer time period: AM = ព្រឹក, PM = ល្ងាច
  const timePeriod = hours < 12 ? 'ព្រឹក' : 'ល្ងាច'

  return `${day}/${month}/${year}, ${hour12}:${minutesStr} ${timePeriod}`
}

export default normalizeKhmerDate


