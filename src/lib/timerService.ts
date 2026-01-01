const API_BASE = '/api';

export const timerService = {
  // Timer starten
  async startTimer(userId: string) {
    const response = await fetch(`${API_BASE}/timer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        action: 'start'
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to start timer');
    }
    
    return response.json();
  },

  // Timer stoppen
  async stopTimer(userId: string, entryId: string) {
    const response = await fetch(`${API_BASE}/timer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        action: 'stop',
        entryId
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to stop timer');
    }
    
    return response.json();
  },

  // Timer Daten abrufen
  async getTimerData(userId: string) {
    const response = await fetch(`${API_BASE}/timer?userId=${userId}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get timer data');
    }
    
    return response.json();
  },

  // Heutige Zeiten abrufen
  async getTodayEntries(userId: string) {
    const data = await this.getTimerData(userId);
    return data.todayEntries || [];
  }
};
