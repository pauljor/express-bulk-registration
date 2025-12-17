/**
 * Format milliseconds to human-readable time string
 * @param milliseconds - Time in milliseconds
 * @returns Human-readable time string (e.g., "2.5 seconds", "3 minutes 15 seconds", "1 hour 30 minutes")
 */
export function formatProcessingTime(milliseconds: number): string {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  }

  const seconds = milliseconds / 1000;

  // Less than 1 minute
  if (seconds < 60) {
    return seconds % 1 === 0 ? `${seconds} seconds` : `${seconds.toFixed(1)} seconds`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Less than 1 hour
  if (minutes < 60) {
    if (remainingSeconds === 0) {
      return minutes === 1 ? '1 minute' : `${minutes} minutes`;
    }
    const minuteText = minutes === 1 ? '1 minute' : `${minutes} minutes`;
    const secondText = remainingSeconds === 1 ? '1 second' : `${remainingSeconds} seconds`;
    return `${minuteText} ${secondText}`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  // Less than 1 day
  if (hours < 24) {
    if (remainingMinutes === 0) {
      return hours === 1 ? '1 hour' : `${hours} hours`;
    }
    const hourText = hours === 1 ? '1 hour' : `${hours} hours`;
    const minuteText = remainingMinutes === 1 ? '1 minute' : `${remainingMinutes} minutes`;
    return `${hourText} ${minuteText}`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (remainingHours === 0) {
    return days === 1 ? '1 day' : `${days} days`;
  }
  const dayText = days === 1 ? '1 day' : `${days} days`;
  const hourText = remainingHours === 1 ? '1 hour' : `${remainingHours} hours`;
  return `${dayText} ${hourText}`;
}
