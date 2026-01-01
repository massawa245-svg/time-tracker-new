# PowerShell Script um MongoDB User zu prüfen

Write-Host " PRÜFE MONGODB USER..." -ForegroundColor Cyan

# 1. Prüfe ob MongoDB läuft
try {
    $mongoProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
    if ($mongoProcess) {
        Write-Host " MongoDB läuft (PID: $($mongoProcess.Id))" -ForegroundColor Green
    } else {
        Write-Host " MongoDB Process nicht gefunden" -ForegroundColor Yellow
    }
} catch {
    Write-Host " MongoDB Check fehlgeschlagen" -ForegroundColor Red
}

# 2. Prüfe .env Datei für MongoDB URI
$envFile = ".\.env.local"
if (Test-Path $envFile) {
    Write-Host "`n .env.local gefunden:" -ForegroundColor Cyan
    $mongoUri = Get-Content $envFile | Where-Object { $_ -match "MONGODB_URI" }
    if ($mongoUri) {
        Write-Host "   $mongoUri" -ForegroundColor White
        
        # Extrahiere die URI für mongo shell
        $uri = $mongoUri -replace "MONGODB_URI=", "" -replace "`"", ""
        Write-Host "   Extrahiert: $uri" -ForegroundColor Gray
    } else {
        Write-Host " Keine MONGODB_URI in .env.local gefunden" -ForegroundColor Red
    }
} else {
    Write-Host " .env.local nicht gefunden" -ForegroundColor Red
}

# 3. Prüfe direkten MongoDB Zugriff (wenn mongo shell verfügbar)
Write-Host "`n VERSUCHE MONGODB VERBINDUNG..." -ForegroundColor Yellow

# Test mit Node.js Script
$testScript = @"
// test-mongo-connection.js
try {
  const mongoose = require('mongoose');
  
  // Standard URI falls nicht in .env
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/time-tracker';
  
  console.log('Verbindung zu:', uri);
  
  mongoose.connect(uri, { 
    serverSelectionTimeoutMS: 5000 
  });
  
  mongoose.connection.on('connected', () => {
    console.log(' MongoDB verbunden!');
    
    // User Schema
    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      role: String,
      isActive: Boolean
    });
    
    const User = mongoose.model('User', userSchema);
    
    // Alle User finden
    User.find({}).select('name email role isActive').lean()
      .then(users => {
        console.log('\n ALLE USER IN DER DATENBANK:');
        console.log('='.repeat(50));
        
        if (users.length === 0) {
          console.log(' Keine User gefunden!');
        } else {
          users.forEach((user, index) => {
            console.log(\`\${index + 1}. \${user.name}\`);
            console.log(\`   Email: \${user.email}\`);
            console.log(\`   Rolle: \${user.role || 'employee'}\`);
            console.log(\`   Aktiv: \${user.isActive}\`);
            console.log('');
          });
          
          // Manager/Admin User
          const managers = users.filter(u => 
            u.role === 'manager' || u.role === 'admin'
          );
          
          console.log('\n MANAGER/ADMIN USER:');
          console.log('='.repeat(50));
          
          if (managers.length === 0) {
            console.log(' Keine Manager/Admin User gefunden!');
          } else {
            managers.forEach((m, i) => {
              console.log(\` \${i + 1}. \${m.name} (\${m.email})\`);
              console.log(\`   Rolle: \${m.role}\`);
            });
          }
        }
        
        mongoose.disconnect();
      })
      .catch(err => {
        console.error('Fehler beim Lesen der User:', err.message);
        mongoose.disconnect();
      });
  });
  
  mongoose.connection.on('error', (err) => {
    console.error(' MongoDB Verbindungsfehler:', err.message);
  });
  
  setTimeout(() => {
    if (mongoose.connection.readyState === 0) {
      console.log(' Timeout: MongoDB nicht erreichbar');
      process.exit(1);
    }
  }, 10000);
  
} catch (error) {
  console.error(' Fehler:', error.message);
}
"@

# Speichere und führe das Test Script aus
$testScript | Set-Content -Path "test-mongo-connection.js" -Encoding UTF8

Write-Host "`n FÜHRE MONGODB CHECK AUS..." -ForegroundColor Green
node test-mongo-connection.js

# Aufräumen
Remove-Item -Path "test-mongo-connection.js" -Force -ErrorAction SilentlyContinue
