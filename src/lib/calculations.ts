// Intelligente Arbeitszeit-Berechnungen
export class TimeCalculator {
  
  // Berechne Netto-Arbeitszeit (Brutto - Pausen)
  static calculateNetHours(startTime: string, endTime: string, breakMinutes: number = 0): number {
    const start = this.timeToMinutes(startTime);
    const end = this.timeToMinutes(endTime);
    const totalMinutes = end - start - breakMinutes;
    return totalMinutes / 60;
  }

  // Konvertiere Zeit-String zu Minuten (08:30 → 510)
  static timeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + (minutes || 0);
  }

  // Konvertiere Minuten zu Zeit-String (510 → 08:30)
  static minutesToTime(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  // Berechne Überstunden (Ist vs. Soll)
  static calculateOvertime(actualHours: number, plannedHours: number): number {
    return actualHours - plannedHours;
  }

  // Auto-Pausen-Erkennung (nach 6h Arbeit)
  static calculateAutoBreak(workedHours: number): number {
    if (workedHours > 6) {
      return 30; // 30min Pause nach 6h
    } else if (workedHours > 9) {
      return 45; // 45min Pause nach 9h
    }
    return 0;
  }

  // Runde auf 15min Intervalle (Zeiterfassung standard)
  static roundToQuarterHour(minutes: number): number {
    return Math.round(minutes / 15) * 15;
  }

  // Berechne Effizienz-Score (0-100%)
  static calculateEfficiency(actualHours: number, plannedHours: number): number {
    if (plannedHours === 0) return 100;
    const ratio = (actualHours / plannedHours) * 100;
    return Math.min(Math.max(ratio, 0), 100); // Begrenze auf 0-100%
  }
}