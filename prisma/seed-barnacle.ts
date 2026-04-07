import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const barnacleData = [
  {
    id: 'cmnnuujfc0000opbl2af5f2h5',
    name: 'Margaret E. Harlow',
    birthYear: 1958,
    firstElectedYear: 1992,
    prePoliticsCareer: 'Public school teacher, union organizer',
    estimatedNetWorth: 3200000,
  },
  {
    id: 'cmnnuul5u0010opbljc9dy1bg',
    name: 'Robert T. Caldwell',
    birthYear: 1955,
    firstElectedYear: 1994,
    prePoliticsCareer: 'Oil & gas attorney',
    estimatedNetWorth: 28500000,
  },
  {
    id: 'cmnnuumnw0020opbl88dbotkk',
    name: 'Diana S. Chen',
    birthYear: 1972,
    firstElectedYear: 2008,
    prePoliticsCareer: 'Civil rights attorney, nonprofit director',
    estimatedNetWorth: 1800000,
  },
  {
    id: 'cmnnuunxb002wopbl8qz7w08m',
    name: 'William P. Ashford',
    birthYear: 1961,
    firstElectedYear: 1992,
    prePoliticsCareer: 'Investment banker (8 years), then full-time politics',
    estimatedNetWorth: 12400000,
  },
  {
    id: 'cmnnuup36003sopblsgxyf9ez',
    name: 'Elena V. Castillo',
    birthYear: 1975,
    firstElectedYear: 2010,
    prePoliticsCareer: 'NHS nurse, trade union rep',
    estimatedNetWorth: 420000,
  },
  {
    id: 'cmnnuuq3g004nopbl2k9005sz',
    name: 'James R. Whitmore',
    birthYear: 1963,
    firstElectedYear: 1998,
    prePoliticsCareer: 'Car dealership owner',
    estimatedNetWorth: 9100000,
  },
  {
    id: 'cmnnuurah005jopblvbdwxdyf',
    name: 'Sandra L. Torres',
    birthYear: 1967,
    firstElectedYear: 2002,
    prePoliticsCareer: 'Community organizer, city commissioner',
    estimatedNetWorth: 2100000,
  },
  {
    id: 'cmnnuush4006fopblnmadb2c9',
    name: 'Thomas H. Brennan',
    birthYear: 1959,
    firstElectedYear: 1989,
    prePoliticsCareer: 'Marine Corps officer (8 years)',
    estimatedNetWorth: 6800000,
  },
]

async function main() {
  console.log('Seeding barnacle fields for 8 politicians...\n')

  for (const data of barnacleData) {
    await prisma.politician.update({
      where: { id: data.id },
      data: {
        birthYear: data.birthYear,
        firstElectedYear: data.firstElectedYear,
        prePoliticsCareer: data.prePoliticsCareer,
        estimatedNetWorth: data.estimatedNetWorth,
      },
    })
    console.log(`✔ Updated: ${data.name}`)
  }

  console.log('\nDone.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })