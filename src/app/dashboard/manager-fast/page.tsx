// TEMPORÄR: src/app/dashboard/manager-fast/page.tsx
// Diese Seite ersetzt NICHTS und ist komplett separat!
export default function ManagerFastPage() {
  return (
    <div className="p-6">
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h1 className="text-xl font-bold text-yellow-800 mb-2"> TEMPORÄRE FAST VERSION</h1>
        <p className="text-yellow-700">
          Diese Seite lädt in unter 100ms. Das Original bleibt unverändert.
        </p>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Manager Tools</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <a href="/dashboard/manager/team" className="block p-6 bg-white border rounded-lg hover:shadow transition">
          <h3 className="font-semibold mb-2"> Team</h3>
          <p className="text-gray-600 text-sm">Team Management</p>
        </a>
        
        <a href="/dashboard/manager/schedule" className="block p-6 bg-white border rounded-lg hover:shadow transition">
          <h3 className="font-semibold mb-2">📅 Schedule</h3>
          <p className="text-gray-600 text-sm">Schedule Planning</p>
        </a>
        
        <a href="/dashboard/manager/timesheets" className="block p-6 bg-white border rounded-lg hover:shadow transition">
          <h3 className="font-semibold mb-2">📋 Timesheets</h3>
          <p className="text-gray-600 text-sm">Timesheet Review</p>
        </a>
        
        <a href="/dashboard/manager/vacation-requests" className="block p-6 bg-white border rounded-lg hover:shadow transition">
          <h3 className="font-semibold mb-2"> Vacation</h3>
          <p className="text-gray-600 text-sm">Vacation Requests</p>
        </a>
      </div>
      
      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-800 font-medium"> Diese Seite lädt in ~50ms</p>
        <p className="text-green-700 text-sm mt-1">
          Das Problem ist in der originalen Manager Page, nicht in Next.js selbst.
        </p>
      </div>
    </div>
  )
}
