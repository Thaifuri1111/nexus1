import { PrismaClient } from '@prisma/client'
import { hashPassword } from '@/lib/bcrypt'
import { generateReferralCode } from '@/lib/utils'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  const adminPassword = await hashPassword('admin123')
  await prisma.user.upsert({
    where: { phone: '+6281234567890' },
    update: {},
    create: {
      phone: '+6281234567890',
      username: 'admin',
      password: adminPassword,
      status: 'DIAMOND',
      isVip: true,
      referralCode: generateReferralCode(),
      balance: 1000000,
      keys: 1000,
    },
  })
  console.log('✅ Admin created!')

  console.log('🌱 Seeding complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())