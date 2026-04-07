import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const politician = await prisma.politician.findUnique({
      where: { id },
      include: {
        votes: {
          orderBy: { date: 'desc' },
          include: {
            alignments: {
              include: {
                statement: true,
              },
            },
          },
        },
        statements: {
          orderBy: { date: 'desc' },
        },
        contributions: {
          orderBy: { year: 'desc' },
          include: {
            donor: true,
          },
        },
        scores: {
          orderBy: { calculatedAt: 'desc' },
          take: 1,
        },
        barnacleScores: {
          orderBy: { calculatedAt: 'desc' },
          take: 1,
        },
      },
    })

    if (!politician) {
      return NextResponse.json(
        { error: 'Politician not found' },
        { status: 404 }
      )
    }

    const response = {
      id: politician.id,
      name: politician.name,
      initials: politician.initials,
      party: politician.party,
      level: politician.level,
      country: politician.country,
      jurisdiction: politician.jurisdiction,
      role: politician.role,
      since: politician.since,
      bio: politician.bio,
      imageUrl: politician.imageUrl,
      birthYear: politician.birthYear,
      firstElectedYear: politician.firstElectedYear,
      prePoliticsCareer: politician.prePoliticsCareer,
      estimatedNetWorth: politician.estimatedNetWorth,
      votes: politician.votes,
      statements: politician.statements,
      contributions: politician.contributions,
      integrityScore: politician.scores[0] ?? null,
      barnacleScore: politician.barnacleScores[0] ?? null,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[GET /api/politicians/[id]]', error)
    return NextResponse.json(
      { error: 'Failed to fetch politician' },
      { status: 500 }
    )
  }
}