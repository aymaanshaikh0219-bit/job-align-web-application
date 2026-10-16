import { getJobs } from '@/lib/jobs-provider'

export async function GET() {
  const data = await getJobs()
  return Response.json(data)
}
