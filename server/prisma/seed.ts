import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@ndula.com' },
    update: {},
    create: {
      email: 'admin@ndula.com',
      passwordHash: hashedPassword,
      emailVerified: true,
      isActive: true,
      profile: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
          phone: '+254712345678',
        },
      },
      userRoles: {
        create: [
          { role: 'SUPER_ADMIN' },
          { role: 'ADMIN' },
        ],
      },
    },
  });

  console.log('✅ Admin user created:', adminUser.email);
  console.log('📧 Email: admin@ndula.com');
  console.log('🔑 Password: admin123');

  // Create customer user
  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      passwordHash: hashedPassword,
      emailVerified: true,
      isActive: true,
      profile: {
        create: {
          firstName: 'John',
          lastName: 'Doe',
          phone: '+254723456789',
        },
      },
      userRoles: {
        create: [
          { role: 'CUSTOMER' },
        ],
      },
      addresses: {
        create: [
          {
            street: '123 Kimathi Street',
            city: 'Nairobi',
            state: 'Nairobi County',
            postalCode: '00100',
            country: 'Kenya',
            isDefault: true,
          },
        ],
      },
    },
  });

  console.log('✅ Customer user created:', customerUser.email);

  // Create products
  const products = [
    // Men's Products
    {
      name: 'Air Max 270',
      description: 'Experience ultimate comfort with the Air Max 270. Featuring a large Air unit heel for maximum cushioning and a sleek, modern design perfect for everyday wear.',
      price: 15995,
      category: 'MEN',
      subcategory: 'SHOES',
      sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'],
      colors: ['Black', 'White', 'Blue', 'Red'],
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
      stock: 45,
      brand: 'Nike',
      featured: true,
    },
    {
      name: 'Classic Polo Shirt',
      description: 'Timeless polo shirt crafted from premium cotton. Features a classic collar, button placket, and the signature embroidered logo. Perfect for both casual and semi-formal occasions.',
      price: 4500,
      category: 'MEN',
      subcategory: 'SHIRTS',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Navy', 'White', 'Black', 'Red'],
      images: ['https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800'],
      stock: 60,
      brand: 'Lacoste',
      featured: false,
    },
    {
      name: 'Slim Fit Denim Jeans',
      description: 'Premium quality denim jeans with a modern slim fit. Features five-pocket styling, button fly, and reinforced stitching for durability. The perfect everyday jean.',
      price: 6800,
      category: 'MEN',
      subcategory: 'PANTS',
      sizes: ['30', '32', '34', '36', '38'],
      colors: ['Dark Blue', 'Light Blue', 'Black'],
      images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'],
      stock: 38,
      brand: "Levi's",
      featured: true,
    },
    {
      name: 'Leather Bomber Jacket',
      description: 'Classic bomber jacket crafted from genuine leather. Features ribbed collar and cuffs, zip closure, and multiple pockets. A timeless piece that adds edge to any outfit.',
      price: 18500,
      category: 'MEN',
      subcategory: 'JACKETS',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Brown'],
      images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'],
      stock: 22,
      brand: 'Zara',
      featured: false,
    },
    {
      name: 'Wool Blend Sweater',
      description: 'Cozy wool blend sweater with a classic crew neck design. Perfect for layering in cooler weather. Features ribbed cuffs and hem for a comfortable fit.',
      price: 5200,
      category: 'MEN',
      subcategory: 'SWEATERS',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Gray', 'Navy', 'Burgundy', 'Beige'],
      images: ['https://images.unsplash.com/photo-1520367745676-56196632073f?w=800'],
      stock: 55,
      brand: 'H&M',
      featured: false,
    },
    // Women's Products
    {
      name: 'React Infinity Run',
      description: 'Engineered for long-distance running with React foam cushioning. Features a secure fit with Flyknit upper and enhanced stability for your stride.',
      price: 12499,
      category: 'WOMEN',
      subcategory: 'SHOES',
      sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
      colors: ['Pink', 'White', 'Black', 'Purple'],
      images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800'],
      stock: 32,
      brand: 'Nike',
      featured: true,
    },
    {
      name: 'Floral Summer Dress',
      description: 'Beautiful floral print summer dress with a flattering A-line silhouette. Features adjustable shoulder straps, side pockets, and a flowing midi length perfect for warm days.',
      price: 5800,
      category: 'WOMEN',
      subcategory: 'DRESSES',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Blue Floral', 'Pink Floral', 'Yellow Floral'],
      images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800'],
      stock: 48,
      brand: 'Zara',
      featured: true,
    },
    {
      name: 'Silk Blend Blouse',
      description: 'Elegant silk blend blouse with a relaxed fit. Features button front closure, long sleeves with cuffs, and a curved hem. Perfect for office or evening wear.',
      price: 4200,
      category: 'WOMEN',
      subcategory: 'SHIRTS',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Ivory', 'Black', 'Blush', 'Navy'],
      images: ['https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=800'],
      stock: 41,
      brand: 'Massimo Dutti',
      featured: false,
    },
    {
      name: 'High-Waisted Wide Leg Pants',
      description: 'Sophisticated high-waisted pants with a flattering wide leg silhouette. Features side pockets, belt loops, and a tailored fit that elongates the legs.',
      price: 6300,
      category: 'WOMEN',
      subcategory: 'PANTS',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Black', 'Beige', 'Navy', 'White'],
      images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800'],
      stock: 36,
      brand: 'Mango',
      featured: false,
    },
    {
      name: 'Quilted Puffer Jacket',
      description: 'Stylish quilted puffer jacket with a slim fit. Features zip and snap closure, side pockets, and lightweight insulation. Water-resistant finish keeps you dry.',
      price: 12800,
      category: 'WOMEN',
      subcategory: 'JACKETS',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Black', 'Navy', 'Burgundy'],
      images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800'],
      stock: 28,
      brand: 'North Face',
      featured: true,
    },
    // Kids' Products
    {
      name: 'Junior Cortez',
      description: 'Classic Cortez style adapted for kids. Features durable leather upper, foam midsole for comfort, and rubber outsole for traction. Perfect for active kids.',
      price: 6999,
      category: 'KIDS',
      subcategory: 'SHOES',
      sizes: ['UK 10', 'UK 11', 'UK 12', 'UK 13', 'UK 1', 'UK 2'],
      colors: ['White/Red', 'Black', 'Blue'],
      images: ['https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800'],
      stock: 58,
      brand: 'Nike',
      featured: false,
    },
    {
      name: 'Kids Cotton T-Shirt Pack',
      description: 'Pack of 3 comfortable cotton t-shirts in various colors. Soft, breathable fabric perfect for everyday wear. Features ribbed crew neck and durable stitching.',
      price: 2800,
      category: 'KIDS',
      subcategory: 'SHIRTS',
      sizes: ['4Y', '6Y', '8Y', '10Y', '12Y'],
      colors: ['Multi-Color Pack'],
      images: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800'],
      stock: 72,
      brand: 'Next',
      featured: false,
    },
    {
      name: 'Kids Denim Jeans',
      description: 'Durable denim jeans designed for active kids. Features adjustable waistband, reinforced knees, and soft stretch fabric for comfort and mobility.',
      price: 3500,
      category: 'KIDS',
      subcategory: 'PANTS',
      sizes: ['4Y', '6Y', '8Y', '10Y', '12Y', '14Y'],
      colors: ['Blue', 'Black', 'Light Blue'],
      images: ['https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800'],
      stock: 65,
      brand: 'Gap',
      featured: false,
    },
    {
      name: 'Hooded Rain Jacket',
      description: 'Waterproof rain jacket with attached hood. Features reflective details for safety, zip closure, and multiple pockets. Keeps kids dry during rainy days.',
      price: 4800,
      category: 'KIDS',
      subcategory: 'JACKETS',
      sizes: ['4Y', '6Y', '8Y', '10Y', '12Y'],
      colors: ['Yellow', 'Blue', 'Red', 'Green'],
      images: ['https://images.unsplash.com/photo-1503944168550-944f65c0e3d3?w=800'],
      stock: 44,
      brand: 'Columbia',
      featured: false,
    },
    // Accessories
    {
      name: 'Leather Crossbody Bag',
      description: 'Compact crossbody bag crafted from premium leather. Features adjustable strap, zip closure, and multiple compartments. Perfect for everyday essentials.',
      price: 7500,
      category: 'ACCESSORIES',
      subcategory: 'BAGS',
      sizes: ['One Size'],
      colors: ['Black', 'Brown', 'Tan', 'Navy'],
      images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800'],
      stock: 33,
      brand: 'Fossil',
      featured: false,
    },
    {
      name: 'Minimalist Watch',
      description: 'Elegant minimalist watch with stainless steel case and genuine leather strap. Features quartz movement, date display, and water resistance to 50m.',
      price: 9800,
      category: 'ACCESSORIES',
      subcategory: 'WATCHES',
      sizes: ['One Size'],
      colors: ['Black/Silver', 'Brown/Gold', 'Black/Rose Gold'],
      images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800'],
      stock: 26,
      brand: 'Daniel Wellington',
      featured: true,
    },
  ];

  // Insert products; avoid FK issues by not deleting existing ones
  await prisma.product.createMany({
    data: products as any[],
    skipDuplicates: true, // if a unique constraint exists in future, this will skip
  });

  console.log('✅ Products inserted (skipping duplicates if any):', products.length);

  console.log('🌱 Database seeding completed!');
  console.log('\n📝 Login credentials:');
  console.log('Admin: admin@ndula.com / admin123');
  console.log('Customer: customer@example.com / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
