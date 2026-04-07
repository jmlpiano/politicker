const CONGRESS_API_KEY = process.env.CONGRESS_API_KEY

const politicians = [
  { name: 'Pelosi', firstName: 'Nancy', state: 'CA' },
  { name: 'McConnell', firstName: 'Mitch', state: 'KY' },
  { name: 'Ocasio-Cortez', firstName: 'Alexandria', state: 'NY' },
  { name: 'Cruz', firstName: 'Ted', state: 'TX' },
  { name: 'Sanders', firstName: 'Bernard', state: 'VT' },
  { name: 'Warren', firstName: 'Elizabeth', state: 'MA' },
  { name: 'Paul', firstName: 'Rand', state: 'KY' },
  { name: 'Khanna', firstName: 'Ro', state: 'CA' },
  { name: 'Greene', firstName: 'Marjorie', state: 'GA' },
  { name: 'Hawley', firstName: 'Josh', state: 'MO' },
]

async function lookupMember(lastName: string, firstName: string, state: string) {
  const url = `https://api.congress.gov/v3/member?name=${lastName}&api_key=${CONGRESS_API_KEY}&limit=10`
  const res = await fetch(url)
  const data = await res.json()

  const members = data.members ?? []
  const match = members.find((m: any) =>
    m.name?.toLowerCase().includes(firstName.toLowerCase()) &&
    m.state === state
  )

  return {
    name: `${firstName} ${lastName}`,
    bioguideId: match?.bioguideId ?? 'NOT FOUND',
    state: match?.state ?? state,
    party: match?.partyName ?? 'unknown',
    currentMember: match?.currentMember ?? false,
    terms: match?.terms?.item?.length ?? 0,
  }
}

async function main() {
  console.log('Looking up BioGuide IDs...\n')
  for (const p of politicians) {
    const result = await lookupMember(p.name, p.firstName, p.state)
    console.log(`${result.name}: ${result.bioguideId} | ${result.party} | Current: ${result.currentMember}`)
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 300))
  }
}

main().catch(console.error)