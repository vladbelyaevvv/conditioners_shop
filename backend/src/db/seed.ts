import { eq } from "drizzle-orm";
import { db, pool } from "./index.js";
import { brands, categories, products } from "./schema.js";

async function seed() {
  await db
    .insert(brands)
    .values([
      { name: "Daikin", slug: "daikin", country: "Япония" },
      { name: "Haier", slug: "haier", country: "Китай" },
      { name: "Ballu", slug: "ballu", country: "Китай" },
      { name: "LG", slug: "lg", country: "Южная Корея" },
      { name: "Samsung", slug: "samsung", country: "Южная Корея" },
      { name: "Mitsubishi Electric", slug: "mitsubishi-electric", country: "Япония" },
    ])
    .onConflictDoNothing();
  await db
    .insert(categories)
    .values([
      { name: "Сплит-системы", slug: "split-systems", description: "Настенные системы для дома и офиса" },
      { name: "Мобильные", slug: "mobile", description: "Кондиционеры без стационарного монтажа" },
    ])
    .onConflictDoNothing();

  const [daikin] = await db.select().from(brands).where(eq(brands.slug, "daikin"));
  const [haier] = await db.select().from(brands).where(eq(brands.slug, "haier"));
  const [ballu] = await db.select().from(brands).where(eq(brands.slug, "ballu"));
  const [lg] = await db.select().from(brands).where(eq(brands.slug, "lg"));
  const [samsung] = await db.select().from(brands).where(eq(brands.slug, "samsung"));
  const [mitsubishi] = await db.select().from(brands).where(eq(brands.slug, "mitsubishi-electric"));
  const [split] = await db.select().from(categories).where(eq(categories.slug, "split-systems"));
  const [mobile] = await db.select().from(categories).where(eq(categories.slug, "mobile"));
  if (!daikin || !haier || !ballu || !lg || !samsung || !mitsubishi || !split || !mobile) {
    throw new Error("Seed references are missing");
  }

  await db
    .insert(products)
    .values([
      {
        name: "Daikin Sensira",
        slug: "daikin-sensira-ftxf25",
        model: "FTXF25",
        description: "Тихая инверторная сплит-система для спальни или небольшой гостиной.",
        price: "64990",
        coolingCapacityKw: "2.50",
        recommendedArea: 25,
        energyClass: "A++",
        stockQuantity: 7,
        imageUrl: "https://images.unsplash.com/photo-1631545806609-1df1b0d39159?auto=format&fit=crop&w=1200&q=80",
        brandId: daikin.id,
        categoryId: split.id,
      },
      {
        name: "Haier Coral",
        slug: "haier-coral-hsu-09",
        model: "HSU-09HPL103",
        description: "Энергоэффективная модель с режимом осушения и ночной работой.",
        price: "41990",
        coolingCapacityKw: "2.60",
        recommendedArea: 26,
        energyClass: "A",
        stockQuantity: 12,
        imageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",
        brandId: haier.id,
        categoryId: split.id,
      },
      {
        name: "Ballu Smart Wind",
        slug: "ballu-smart-wind-bpac-09",
        model: "BPAC-09",
        description: "Мобильный кондиционер для помещений, где невозможно установить внешний блок.",
        price: "32990",
        coolingCapacityKw: "2.40",
        recommendedArea: 24,
        energyClass: "A",
        stockQuantity: 4,
        imageUrl: "https://images.unsplash.com/photo-1590756254933-2873d72a83b6?auto=format&fit=crop&w=1200&q=80",
        brandId: ballu.id,
        categoryId: mobile.id,
      },
      {
        name: "Daikin Sensira 20",
        slug: "daikin-sensira-ftxf20f",
        model: "FTXF20F / RXF20F",
        description: "Компактная инверторная сплит-система с тихим режимом и сезонной энергоэффективностью до A++.",
        price: "58990",
        coolingCapacityKw: "2.00",
        recommendedArea: 20,
        energyClass: "A++",
        stockQuantity: 6,
        imageUrl: null,
        brandId: daikin.id,
        categoryId: split.id,
      },
      {
        name: "Daikin Sensira 35",
        slug: "daikin-sensira-ftxf35f",
        model: "FTXF35F / RXF35F",
        description: "Инверторная модель для гостиной или кабинета с комфортным распределением воздуха и управлением режимами.",
        price: "82990",
        coolingCapacityKw: "3.30",
        recommendedArea: 35,
        energyClass: "A++",
        stockQuantity: 5,
        imageUrl: null,
        brandId: daikin.id,
        categoryId: split.id,
      },
      {
        name: "Daikin Sensira 50",
        slug: "daikin-sensira-ftxf50f",
        model: "FTXF50F / RXF50F",
        description: "Производительная настенная система для просторных помещений с охлаждением, обогревом и режимом осушения.",
        price: "124990",
        coolingCapacityKw: "5.00",
        recommendedArea: 50,
        energyClass: "A++",
        stockQuantity: 3,
        imageUrl: null,
        brandId: daikin.id,
        categoryId: split.id,
      },
      {
        name: "Haier Coral 07",
        slug: "haier-coral-hsu-07hpl103",
        model: "HSU-07HPL103",
        description: "Доступная сплит-система для небольшой комнаты с ночным режимом, осушением и авторестартом.",
        price: "34990",
        coolingCapacityKw: "2.10",
        recommendedArea: 20,
        energyClass: "A",
        stockQuantity: 10,
        imageUrl: null,
        brandId: haier.id,
        categoryId: split.id,
      },
      {
        name: "Haier Coral 12",
        slug: "haier-coral-hsu-12hpl103",
        model: "HSU-12HPL103",
        description: "Настенная сплит-система для комнаты среднего размера с интенсивным охлаждением и комфортным ночным режимом.",
        price: "51990",
        coolingCapacityKw: "3.50",
        recommendedArea: 35,
        energyClass: "A",
        stockQuantity: 8,
        imageUrl: null,
        brandId: haier.id,
        categoryId: split.id,
      },
      {
        name: "Ballu Eco Smart 09",
        slug: "ballu-eco-smart-bsyi-09hn8",
        model: "BSYI-09HN8/ES",
        description: "Инверторная сплит-система на хладагенте R32 с тихой работой от 21 дБ и классом энергоэффективности A.",
        price: "38990",
        coolingCapacityKw: "2.78",
        recommendedArea: 27,
        energyClass: "A",
        stockQuantity: 11,
        imageUrl: null,
        brandId: ballu.id,
        categoryId: split.id,
      },
      {
        name: "Ballu Eco Smart 18",
        slug: "ballu-eco-smart-bsyi-18hn8",
        model: "BSYI-18HN8/ES",
        description: "Мощная инверторная система для большой гостиной или офиса с энергоэффективным охлаждением и обогревом.",
        price: "76990",
        coolingCapacityKw: "5.28",
        recommendedArea: 53,
        energyClass: "A++",
        stockQuantity: 4,
        imageUrl: null,
        brandId: ballu.id,
        categoryId: split.id,
      },
      {
        name: "LG DUALCOOL 09",
        slug: "lg-dualcool-s4-w09ja2pd",
        model: "S4-W09JA2PD",
        description: "Инверторная модель с быстрым охлаждением, контролем энергопотребления и тихой работой внутреннего блока.",
        price: "57990",
        coolingCapacityKw: "2.64",
        recommendedArea: 26,
        energyClass: "A++",
        stockQuantity: 7,
        imageUrl: null,
        brandId: lg.id,
        categoryId: split.id,
      },
      {
        name: "LG DUALCOOL Prestige",
        slug: "lg-dualcool-prestige-lan090hyv3",
        model: "LAN090HYV3",
        description: "Премиальная инверторная сплит-система с Wi-Fi, быстрым охлаждением, обогревом и низким уровнем шума.",
        price: "94990",
        coolingCapacityKw: "2.64",
        recommendedArea: 27,
        energyClass: "A++",
        stockQuantity: 2,
        imageUrl: null,
        brandId: lg.id,
        categoryId: split.id,
      },
      {
        name: "Samsung WindFree Comfort",
        slug: "samsung-windfree-comfort-ar09txfca",
        model: "AR09TXFCAWKNEU",
        description: "Инверторная система с технологией мягкого охлаждения WindFree и равномерным распределением воздуха.",
        price: "69990",
        coolingCapacityKw: "2.50",
        recommendedArea: 25,
        energyClass: "A++",
        stockQuantity: 6,
        imageUrl: null,
        brandId: samsung.id,
        categoryId: split.id,
      },
      {
        name: "Mitsubishi Electric MSZ-AP25",
        slug: "mitsubishi-electric-msz-ap25",
        model: "MSZ-AP25VGD2",
        description: "Тихая инверторная сплит-система с ночным режимом и защитным покрытием теплообменника.",
        price: "89990",
        coolingCapacityKw: "2.50",
        recommendedArea: 25,
        energyClass: "A++",
        stockQuantity: 5,
        imageUrl: null,
        brandId: mitsubishi.id,
        categoryId: split.id,
      },
      {
        name: "Mitsubishi Electric MSZ-EF42",
        slug: "mitsubishi-electric-msz-ef42",
        model: "MSZ-EF42VGK",
        description: "Дизайнерская настенная система с тихим режимом, недельным таймером и эффективной фильтрацией воздуха.",
        price: "139990",
        coolingCapacityKw: "4.20",
        recommendedArea: 42,
        energyClass: "A++",
        stockQuantity: 3,
        imageUrl: null,
        brandId: mitsubishi.id,
        categoryId: split.id,
      },
    ])
    .onConflictDoNothing();

  const productImages: Record<string, string> = {
    "daikin-sensira-ftxf25": "/images/products/daikin-sensira.jpg",
    "daikin-sensira-ftxf20f": "/images/products/daikin-sensira.jpg",
    "daikin-sensira-ftxf35f": "/images/products/daikin-sensira.jpg",
    "daikin-sensira-ftxf50f": "/images/products/daikin-sensira.jpg",
    "haier-coral-hsu-09": "/images/products/haier-coral.png",
    "haier-coral-hsu-07hpl103": "/images/products/haier-coral.png",
    "haier-coral-hsu-12hpl103": "/images/products/haier-coral.png",
    "ballu-smart-wind-bpac-09": "/images/products/ballu-mobile.jpg",
    "ballu-eco-smart-bsyi-09hn8": "/images/products/ballu-eco-smart.jpg",
    "ballu-eco-smart-bsyi-18hn8": "/images/products/ballu-eco-smart.jpg",
    "lg-dualcool-s4-w09ja2pd": "/images/products/lg-dualcool.jpg",
    "lg-dualcool-prestige-lan090hyv3": "/images/products/lg-dualcool.jpg",
    "samsung-windfree-comfort-ar09txfca": "/images/products/samsung-windfree.png",
    "mitsubishi-electric-msz-ap25": "/images/products/mitsubishi-ap.png",
    "mitsubishi-electric-msz-ef42": "/images/products/mitsubishi-ef.png",
  };

  for (const [slug, imageUrl] of Object.entries(productImages)) {
    await db.update(products).set({ imageUrl }).where(eq(products.slug, slug));
  }
}

seed()
  .then(() => console.log("Seed completed"))
  .finally(() => pool.end());
