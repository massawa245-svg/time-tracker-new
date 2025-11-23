const API_BASE = '/api';

export const timerService = {
  // Timer starten
  async startTimer(userId: string, projectId: string, description: string) {
    const response = await fetch(`${API_BASE}/timer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        projectId, 
        description
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to start timer');
    }
    
    return response.json();
  },

  // Timer stoppen
  async stopTimer(userId: string) {
    const response = await fetch(`${API_BASE}/timer`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to stop timer');
    }
    
    return response.json();
  },

  // Timer Daten abrufen
  async getTimerData(userId: string) {
    const response = await fetch(`${API_BASE}/timer?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get timer data');
    }
    
    return response.json();
  },

  // Heutige Zeiten abrufen
  async getTodayEntries(userId: string) {
    const response = await fetch(`${API_BASE}/timer?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get today entries');
    }
    
    const data = await response.json();
    return data.todayEntries || [];
  }
};