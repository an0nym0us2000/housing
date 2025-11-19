import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@housing.com' },
    update: {},
    create: {
      email: 'admin@housing.com',
      name: 'Admin User',
      password: adminPassword,
      role: UserRole.ADMIN,
      emailVerified: true,
      phoneVerified: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create sample cities
  const bangalore = await prisma.city.upsert({
    where: { name_state: { name: 'Bangalore', state: 'Karnataka' } },
    update: {},
    create: {
      name: 'Bangalore',
      state: 'Karnataka',
      priority: 1,
      latitude: 12.9716,
      longitude: 77.5946,
    },
  });
  console.log('✅ City created:', bangalore.name);

  const mumbai = await prisma.city.upsert({
    where: { name_state: { name: 'Mumbai', state: 'Maharashtra' } },
    update: {},
    create: {
      name: 'Mumbai',
      state: 'Maharashtra',
      priority: 2,
      latitude: 19.0760,
      longitude: 72.8777,
    },
  });
  console.log('✅ City created:', mumbai.name);

  const delhi = await prisma.city.upsert({
    where: { name_state: { name: 'Delhi', state: 'Delhi' } },
    update: {},
    create: {
      name: 'Delhi',
      state: 'Delhi',
      priority: 3,
      latitude: 28.7041,
      longitude: 77.1025,
    },
  });
  console.log('✅ City created:', delhi.name);

  // Create localities for Bangalore
  const localities = [
    { name: 'Koramangala', cityId: bangalore.id, pincode: '560095' },
    { name: 'Whitefield', cityId: bangalore.id, pincode: '560066' },
    { name: 'HSR Layout', cityId: bangalore.id, pincode: '560102' },
    { name: 'Indiranagar', cityId: bangalore.id, pincode: '560038' },
  ];

  for (const locality of localities) {
    await prisma.locality.upsert({
      where: { name_cityId: { name: locality.name, cityId: locality.cityId } },
      update: {},
      create: locality,
    });
    console.log('✅ Locality created:', locality.name);
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
