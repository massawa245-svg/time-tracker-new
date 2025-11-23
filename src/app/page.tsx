import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">TimeTracker Pro</h1>
        <p className="text-gray-600 mb-8">Professional Time Tracking Application</p>
        
        <div className="space-y-4">
          <Link 
            href="/auth/login"
            className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Zum Login
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Demo Accounts:</p>
            <p>demo@company.com / demo123</p>
            <p>manager@company.com / demo123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
