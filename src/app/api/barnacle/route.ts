import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateBarnacleScore } from '@/lib/barnacle'

// POST /api/barnacle — calculate score for one or all politicians
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { politicianId } = body

    const politicians = politicianId
      ? await prisma.politician.findMany({ where: { id: politicianId } })
      : await prisma.politician.findMany()

    if (politicians.length === 0) {
      return NextResponse.json({ error: 'No politicians found' }, { status: 404 })
    }

    const results = []

    for (const p of politicians) {
      const scores = await calculateBarnacleScore(p)
      results.push({
        id: p.id,
        name: p.name,
        ...scores,
      })
      console.log(`✔ Barnacle score calculated: ${p.name} — ${scores.barnacleScore}/100`)
    }

    return NextResponse.json({ calculated: results.length, results })
  } catch (error) {
    console.error('[POST /api/barnacle]', error)
    return NextResponse.json(
      {
        error: 'Failed to calculate barnacle scores',
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}