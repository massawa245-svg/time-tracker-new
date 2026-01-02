export const dynamic = 'force-dynamic'

export async function GET() {
  return new Response(JSON.stringify({ 
    success: false, 
    message: 'Email feature disabled for build' 
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
