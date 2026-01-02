export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  return new Response(JSON.stringify({ 
    success: false, 
    message: 'Password reset feature disabled for build' 
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
