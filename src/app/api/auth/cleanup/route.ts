export const dynamic = 'force-dynamic'

export async function GET() {
  return new Response(JSON.stringify({ 
    success: true, 
    message: 'Cleanup API is temporarily simplified'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
