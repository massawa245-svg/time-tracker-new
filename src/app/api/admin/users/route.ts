export const dynamic = 'force-dynamic'

export async function GET() {
  return new Response(JSON.stringify({ 
    success: true, 
    message: 'Admin API is temporarily simplified for deployment' 
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
