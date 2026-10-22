/**
 * Seeds the database from the same catalog the mock service uses, so switching
 * from mock data to Prisma never changes what the storefront shows.
 * Run: npx prisma db seed
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { collections, products } from "../src/lib/data/catalog";

const prisma = new PrismaClient();

async function main() {
  for (const c of collections) {
    await prisma.collection.upsert({
      where: { slug: c.slug },
      update: {},
      create: { slug: c.slug, name: c.name, tagline: c.tagline, image: c.image, gender: c.gender },
    });
  }
  for (const p of products) {
    const collection = await prisma.collection.findUnique({ where: { slug: p.collectionSlug } });
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        name: p.name,
        category: p.category,
        gender: p.gender,
        price: Math.round(p.price * 100),
        compareAt: p.compareAt ? Math.round(p.compareAt * 100) : null,
        rating: p.rating,
        reviewsCount: p.reviews,
        sizes: p.sizes,
        images: p.images,
        badge: p.badge ?? null,
        stock: p.stock,
        description: p.description,
        details: p.details,
        fabric: p.fabric,
        featured: p.featured ?? false,
        collectionId: collection?.id,
        colors: { create: p.colors.map((c) => ({ name: c.name, hex: c.hex })) },
      },
    });
  }
  // Demo accounts (change/remove before production):
  //   admin@streetcreed.co / Admin@123  (ADMIN — can open /admin)
  //   demo@streetcreed.co  / Demo@1234  (CUSTOMER)
  const demoUsers = [
    { name: "Atelier Admin", email: "admin@streetcreed.co", password: "Admin@123", role: "ADMIN" as const },
    { name: "Demo Client", email: "demo@streetcreed.co", password: "Demo@1234", role: "CUSTOMER" as const },
  ];
  for (const u of demoUsers) {
    const passwordHash = await bcrypt.hash(u.password, 12);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { name: u.name, email: u.email, passwordHash, role: u.role },
    });
  }
  console.log(`Seeded ${collections.length} collections, ${products.length} products and ${demoUsers.length} demo users.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
