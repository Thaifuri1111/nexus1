import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Check if admin exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@nexus.com' }
  })

  if (existingAdmin) {
    console.log('Admin user already exists')
    return
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123456', 10)
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@nexus.com',
      phone: '+1234567890',
      name: 'Admin User',
      password: hashedPassword,
      isAdmin: true,
      coins: 1000000n,
    }
  })

  console.log('✓ Admin user created:', admin.email)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })