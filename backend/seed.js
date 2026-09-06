require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/1fi_marketplace";

// Generates a standard 1Fi-style EMI ladder for a given price:
// 3/6/12/24 months at 0% interest, 36/48/60 months at 10.5% interest,
// with a flat cashback on every plan.
function buildEmiPlans(price, cashback) {
  const zeroInterestTenures = [3, 6, 12, 24];
  const interestTenures = [36, 48, 60];
  const plans = [];

  zeroInterestTenures.forEach((tenureMonths) => {
    plans.push({
      tenureMonths,
      monthlyAmount: Math.round(price / tenureMonths),
      interestRate: 0,
      cashback,
    });
  });

  interestTenures.forEach((tenureMonths) => {
    const rate = 10.5;
    const totalPayable = price * (1 + (rate / 100) * (tenureMonths / 12));
    plans.push({
      tenureMonths,
      monthlyAmount: Math.round(totalPayable / tenureMonths),
      interestRate: rate,
      cashback,
    });
  });

  return plans;
}

const products = [
  {
    slug: "iphone-17-pro",
    name: "iPhone 17 Pro",
    brand: "Apple",
    tag: "NEW",
    description: "Apple's flagship Pro smartphone with titanium design and A-series chip.",
    variants: [
      {
        variantId: "256gb-silver",
        label: "256GB / Silver",
        storage: "256GB",
        color: "Silver",
        mrp: 134900,
        price: 127400,
        image: "https://images.unsplash.com/photo-1592286927505-1def25115481?w=600",
        emiPlans: buildEmiPlans(127400, 7500),
      },
      {
        variantId: "256gb-orange",
        label: "256GB / Cosmic Orange",
        storage: "256GB",
        color: "Cosmic Orange",
        mrp: 134900,
        price: 127400,
        image: "https://images.unsplash.com/photo-1695048132805-3c6e29a91b26?w=600",
        emiPlans: buildEmiPlans(127400, 7500),
      },
      {
        variantId: "512gb-blue",
        label: "512GB / Deep Blue",
        storage: "512GB",
        color: "Deep Blue",
        mrp: 154900,
        price: 146400,
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600",
        emiPlans: buildEmiPlans(146400, 8500),
      },
    ],
  },
  {
    slug: "samsung-s24-ultra",
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    tag: "NEW",
    description: "Samsung's top-tier Galaxy S series device with S-Pen support and top-of-line camera.",
    variants: [
      {
        variantId: "256gb-titanium-black",
        label: "256GB / Titanium Black",
        storage: "256GB",
        color: "Titanium Black",
        mrp: 129999,
        price: 119999,
        image: "https://images.unsplash.com/photo-1706798580211-5c0c3f4b3f4a?w=600",
        emiPlans: buildEmiPlans(119999, 6000),
      },
      {
        variantId: "512gb-titanium-gray",
        label: "512GB / Titanium Gray",
        storage: "512GB",
        color: "Titanium Gray",
        mrp: 144999,
        price: 133999,
        image: "https://images.unsplash.com/photo-1706798579981-14a5f0f3f3e4?w=600",
        emiPlans: buildEmiPlans(133999, 7000),
      },
    ],
  },
  {
    slug: "pixel-9-pro",
    name: "Google Pixel 9 Pro",
    brand: "Google",
    tag: "NEW",
    description: "Google's AI-first flagship with a clean Android experience and excellent camera.",
    variants: [
      {
        variantId: "128gb-obsidian",
        label: "128GB / Obsidian",
        storage: "128GB",
        color: "Obsidian",
        mrp: 109999,
        price: 99999,
        image: "https://images.unsplash.com/photo-1697284959723-1b0d4d1a5e4a?w=600",
        emiPlans: buildEmiPlans(99999, 5000),
      },
      {
        variantId: "256gb-porcelain",
        label: "256GB / Porcelain",
        storage: "256GB",
        color: "Porcelain",
        mrp: 119999,
        price: 109999,
        image: "https://images.unsplash.com/photo-1697284960444-7a1e0e0c2f7d?w=600",
        emiPlans: buildEmiPlans(109999, 5500),
      },
    ],
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB for seeding...");

  await Product.deleteMany({});
  await Product.insertMany(products);

  console.log(`Seeded ${products.length} products.`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
