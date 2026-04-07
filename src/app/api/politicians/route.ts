import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const politicians = await prisma.politician.findMany({
      include: {
        scores: {
          orderBy: { calculatedAt: 'desc' },
          take: 1,
        },
        barnacleScores: {
          orderBy: { calculatedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { name: 'asc' },
    })

    const response = politicians.map((p) => ({
      id: p.id,
      name: p.name,
      initials: p.initials,
      party: p.party,
      level: p.level,
      country: p.country,
      jurisdiction: p.jurisdiction,
      role: p.role,
      since: p.since,
      imageUrl: p.imageUrl,
      integrityScore: p.scores[0] ?? null,
      barnacleScore: p.barnacleScores[0] ?? null,
    }))

    return NextResponse.json(response)
  } catch (error) {
    console.error('[GET /api/politicians]', error)
    return NextResponse.json(
      { error: 'Failed to fetch politicians' },
      { status: 500 }
    )
  }
}