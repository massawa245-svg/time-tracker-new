// utils/calculateHours.ts
export function calculateNetHours(startTime: string, endTime: string, pauseMinutes: number): number {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;
  
  let totalMinutes = endTotalMinutes - startTotalMinutes;
  
  // Falls über Mitternacht
  if (totalMinutes < 0) {
    totalMinutes += 24 * 60;
  }
  
  // Pause abziehen
  totalMinutes -= pauseMinutes;
  
  // In Stunden umrechnen
  return Math.round((totalMinutes / 60) * 100) / 100;
}

// Beispiel: calculateNetHours('07:00', '16:00', 45) → 8.25