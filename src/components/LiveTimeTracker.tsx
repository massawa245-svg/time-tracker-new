'use client';
import { useState, useEffect } from 'react';

interface LiveTimeTrackerProps {
  userId: string;
  date: string;
  plannedHours: number;
}

export default function LiveTimeTracker({ userId, date, plannedHours }: LiveTimeTrackerProps) {
  const [currentStatus, setCurrentStatus] = useState<'checked-in' | 'checked-out' | 'on-break'>('checked-out');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [breakStart, setBreakStart] = useState<Date | null>(null);
  const [totalBreakMinutes, setTotalBreakMinutes] = useState(0);
  const [liveTimer, setLiveTimer] = useState(0);

  // Live Timer für aktuelle Session
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (currentStatus === 'checked-in') {
      interval = setInterval(() => {
        setLiveTimer(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [currentStatus]);

  // Check-In Funktion
  const handleCheckIn = async () => {
    const now = new Date();
    setStartTime(now);
    setCurrentStatus('checked-in');
    setLiveTimer(0);
    
    // API Call zum Speichern
    await fetch('/api/work-schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        date,
        actualStart: now,
        status: 'in-progress'
      })
    });
  };

  // Pause Start/Ende
  const handleBreak = async () => {
    if (currentStatus === 'checked-in') {
      // Pause starten
      setBreakStart(new Date());
      setCurrentStatus('on-break');
    } else if (currentStatus === 'on-break') {
      // Pause beenden
      const breakEnd = new Date();
      const breakDuration = breakStart ? Math.round((breakEnd.getTime() - breakStart.getTime()) / 60000) : 0;
      setTotalBreakMinutes(prev => prev + breakDuration);
      setCurrentStatus('checked-in');
      setBreakStart(null);
    }
  };

  // Check-Out Funktion mit Auto-Berechnungen
  const handleCheckOut = async () => {
    const endTime = new Date();
    const workedMinutes = startTime ? Math.round((endTime.getTime() - startTime.getTime()) / 60000) : 0;
    const workedHours = workedMinutes / 60;
    const netHours = workedHours - (totalBreakMinutes / 60);
    const overtime = netHours - plannedHours;

    // Auto-Berechnungen
    const autoBreak = workedHours > 6 ? 30 : 0; // 30min Pause nach 6h
    const finalBreakMinutes = Math.max(totalBreakMinutes, autoBreak);
    const finalNetHours = workedHours - (finalBreakMinutes / 60);
    const finalOvertime = finalNetHours - plannedHours;
    const efficiency = (finalNetHours / plannedHours) * 100;

    // API Call zum Speichern
    await fetch('/api/work-schedule', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        date,
        actualEnd: endTime,
        actualHours: finalNetHours,
        breakMinutes: finalBreakMinutes,
        autoBreak: autoBreak > 0,
        overtime: finalOvertime,
        efficiency: Math.round(efficiency),
        status: 'completed'
      })
    });

    // Reset State
    setCurrentStatus('checked-out');
    setStartTime(null);
    setLiveTimer(0);
    setTotalBreakMinutes(0);
  };

  // Formatierte Anzeige
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">🕒 Live Zeiterfassung</h3>
      
      {/* Status Anzeige */}
      <div className="mb-4">
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
          currentStatus === 'checked-in' ? 'bg-green-100 text-green-800' :
          currentStatus === 'on-break' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {currentStatus === 'checked-in' ? '✅ Eingestempelt' :
           currentStatus === 'on-break' ? '☕ Pause' :
           '⏸️ Ausgestempelt'}
        </div>
      </div>

      {/* Live Timer */}
      {currentStatus !== 'checked-out' && (
        <div className="text-2xl font-mono text-center mb-4 bg-gray-50 py-3 rounded">
          ⏱️ {formatTime(liveTimer)}
        </div>
      )}

      {/* Statistiken */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="text-center p-2 bg-blue-50 rounded">
          <div className="font-semibold">Geplant</div>
          <div>{plannedHours}h</div>
        </div>
        <div className="text-center p-2 bg-green-50 rounded">
          <div className="font-semibold">Pausen</div>
          <div>{totalBreakMinutes}min</div>
        </div>
      </div>

      {/* Kontroll-Buttons */}
      <div className="flex gap-2">
        {currentStatus === 'checked-out' ? (
          <button
            onClick={handleCheckIn}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
          >
            📍 Einchecken
          </button>
        ) : (
          <>
            <button
              onClick={handleBreak}
              className={`flex-1 py-2 px-4 rounded-lg transition ${
                currentStatus === 'on-break' 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-yellow-500 text-white hover:bg-yellow-600'
              }`}
            >
              {currentStatus === 'on-break' ? '⏩ Pause Ende' : '☕ Pause Start'}
            </button>
            <button
              onClick={handleCheckOut}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
            >
              📍 Auschecken
            </button>
          </>
        )}
      </div>

      {/* Auto-Benachrichtigungen */}
      {liveTimer > 6 * 3600 && totalBreakMinutes < 30 && (
        <div className="mt-3 p-3 bg-orange-100 border border-orange-300 rounded-lg">
          ⚠️ <strong>Pausen-Erinnerung:</strong> Nach 6h Arbeit sind 30min Pause vorgeschrieben.
        </div>
      )}
    </div>
  );
}