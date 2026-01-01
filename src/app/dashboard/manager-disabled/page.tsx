// DISABLED: src/app/dashboard/manager-disabled/page.tsx
// Extrem einfache Version zum Testen
export default function ManagerDisabledPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1 style={{ color: 'red', fontSize: '24px', marginBottom: '20px' }}>
         DISABLED VERSION (Performance Test)
      </h1>
      <p>This is a minimal test page. If this loads fast, the problem is in the original page code.</p>
      <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
        <p><strong>Original:</strong> /dashboard/manager (32.7 seconds)</p>
        <p><strong>This page:</strong> Should load in &lt; 100ms</p>
      </div>
    </div>
  )
}
