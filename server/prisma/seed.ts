import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Check if admin already exists
  const existingAdmin = await prisma.userRole.findFirst({
    where: { role: 'ADMIN' },
  });

  if (existingAdmin) {
    console.log('⚠️  Admin already exists. Skipping admin creation.');
    return;
  }

  // Create admin user
  const adminEmail = 'admin@ndula.com';
  const adminPassword = 'Admin@123456';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash: hashedPassword,
      emailVerified: true,
      provider: 'EMAIL',
      profile: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
          phone: '+254700000000',
        },
      },
      userRoles: {
        create: {
          role: 'ADMIN',
        },
      },
    },
    include: {
      profile: true,
      userRoles: true,
    },
  });

  console.log('✅ Admin user created successfully!');
  console.log('📧 Email:', adminEmail);
  console.log('🔑 Password:', adminPassword);
  console.log('👤 User ID:', adminUser.id);
  console.log('\n⚠️  IMPORTANT: Change the admin password after first login!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
