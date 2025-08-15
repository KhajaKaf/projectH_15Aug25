// prisma/seed.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const menuData = {
  "Starters & Appetizers": [
    { name: "Veg Manchurian", price: 180, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop" },
    { name: "Gobi Manchurian", price: 160, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop" },
    { name: "Veg 65", price: 170, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop" },
    { name: "Gobi 65", price: 155, image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop" },
    { name: "Gobi Chilly", price: 165, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop" },
    { name: "Chilly Mushroom", price: 190, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop" },
    { name: "Baby Corn Manchurian", price: 185, image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop" },
    { name: "Paneer 65", price: 210, image: "https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=400&h=300&fit=crop" },
    { name: "Chilly Paneer", price: 220, image: "https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=400&h=300&fit=crop" },
    { name: "Mushroom Manchurian", price: 195, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop" },
    { name: "Paneer Manchurian", price: 225, image: "https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=400&h=300&fit=crop" },
    { name: "Baby Corn Chilly", price: 180, image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop" },
    { name: "Chicken Manchurian", price: 260, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop" },
    { name: "Chilly Chicken", price: 280, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop" },
    { name: "Chicken 65", price: 290, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop" },
    { name: "Lemon Chicken", price: 285, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop" },
    { name: "Chicken Mejestic", price: 310, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop" },
    { name: "Paper Chicken", price: 295, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop" },
    { name: "Chicken 555", price: 300, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop" },
    { name: "Chicken Lolipop", price: 320, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop" },
    { name: "Dragon Chicken", price: 330, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop" },
    { name: "Hong Kong Chicken", price: 315, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop" },
    { name: "KK's Special Chicken", price: 350, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop" }
  ],

  "Soups": [
    { name: "Veg Hot & Sour Soup", price: 120, image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop" },
    { name: "Veg Sweet Corn Soup", price: 110, image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop" },
    { name: "Veg Manchow Soup", price: 130, image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop" },
    { name: "Veg Lemon Coriander Soup", price: 125, image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop" },
    { name: "Chicken Hot & Sour Soup", price: 150, image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop" },
    { name: "Chicken Sweet Corn Soup", price: 140, image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop" },
    { name: "Chicken Manchow Soup", price: 160, image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop" },
    { name: "Chicken Lemon Coriander Soup", price: 155, image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop" }
  ],

  "Tandoori & Kebabs": [
    { name: "Tangdi Kabab (Half)", price: 280, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop" },
    { name: "Tandoori (Half)", price: 300, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop" },
    { name: "Haryali Kabab", price: 320, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop" },
    { name: "Chicken Tikka", price: 310, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop" },
    { name: "Reshmi Tikka", price: 330, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop" },
    { name: "Tangdi Kabab (Full)", price: 520, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop" },
    { name: "Malai Kabab", price: 340, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop" },
    { name: "Tandoori (Full)", price: 580, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop" }
  ],

  "Veg Curries": [
    { name: "Dal Fry", price: 140, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop" },
    { name: "Dal Tadka", price: 150, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop" },
    { name: "Mix Veg Curry", price: 180, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop" },
    { name: "Kadai Veg", price: 190, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop" },
    { name: "Kaju Masala", price: 260, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop" },
    { name: "Kaju Tomato", price: 250, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop" },
    { name: "Kaju Paneer", price: 280, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop" },
    { name: "Mushroom Kadai", price: 220, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop" },
    { name: "Paneer Masala", price: 240, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop" },
    { name: "Palak Paneer", price: 230, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop" },
    { name: "Methi Chaman", price: 225, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop" },
    { name: "Mexican Masala", price: 210, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop" },
    { name: "Paneer Achari", price: 245, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop" },
    { name: "Paneer Haryali", price: 255, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop" },
    { name: "Paneer Tikka", price: 270, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop" },
    { name: "KKS Special", price: 290, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop" }
  ],

  // NEW: Non-Veg Curries
  "Non-Veg Curries": [
    { name: "Kaju Chicken Curry", price: 320, image: "https://images.unsplash.com/photo-1625944526203-8e4fddacdc10?w=400&h=300&fit=crop" },
    { name: "Tangdi Masala", price: 340, image: "https://images.unsplash.com/photo-1633945274405-5c0d6a0f0b8d?w=400&h=300&fit=crop" },
    { name: "Fish Curry", price: 360, image: "https://images.unsplash.com/photo-1625944526203-8e4fddacdc10?w=400&h=300&fit=crop" },
    { name: "Fish Masala", price: 370, image: "https://images.unsplash.com/photo-1514516870926-2059896c47cd?w=400&h=300&fit=crop" },
    { name: "Chicken Curry", price: 280, image: "https://images.unsplash.com/photo-1598514982671-3b37c3a3d7a3?w=400&h=300&fit=crop" },
    { name: "Chicken Masala", price: 290, image: "https://images.unsplash.com/photo-1598514982671-3b37c3a3d7a3?w=400&h=300&fit=crop" },
    { name: "Kadai Chicken", price: 310, image: "https://images.unsplash.com/photo-1625944526225-7d8fb85bd90c?w=400&h=300&fit=crop" },
    { name: "Butter Chicken", price: 330, image: "https://images.unsplash.com/photo-1604908176997-4312f8b7ea55?w=400&h=300&fit=crop" },
    { name: "Punjabi Chicken", price: 320, image: "https://images.unsplash.com/photo-1604908176997-4312f8b7ea55?w=400&h=300&fit=crop" },
    { name: "Chicken Do Pyaza", price: 300, image: "https://images.unsplash.com/photo-1625944526203-8e4fddacdc10?w=400&h=300&fit=crop" },
    { name: "Chicken Mughlai", price: 350, image: "https://images.unsplash.com/photo-1625944526225-7d8fb85bd90c?w=400&h=300&fit=crop" },
    { name: "Methi Chicken", price: 300, image: "https://images.unsplash.com/photo-1625944526203-8e4fddacdc10?w=400&h=300&fit=crop" },
    { name: "Chicken Afghani", price: 340, image: "https://images.unsplash.com/photo-1604908176997-4312f8b7ea55?w=400&h=300&fit=crop" },
    { name: "Prawns Fry", price: 380, image: "https://images.unsplash.com/photo-1604908554049-0b1e0ef9b867?w=400&h=300&fit=crop" },
    { name: "KK’s Special Chicken Curry", price: 380, image: "https://images.unsplash.com/photo-1604908176997-4312f8b7ea55?w=400&h=300&fit=crop" },
    { name: "Murg Musalam (Half)", price: 420, image: "https://images.unsplash.com/photo-1514516870926-2059896c47cd?w=400&h=300&fit=crop" },
    { name: "Murg Musalam (Full)", price: 760, image: "https://images.unsplash.com/photo-1514516870926-2059896c47cd?w=400&h=300&fit=crop" }
  ],

  // NEW: Biryani
  "Biryani": [
    { name: "Chicken Hyderabadi Biryani (Half)", price: 220, image: "https://images.unsplash.com/photo-1596797038530-2c107229f2d3?w=400&h=300&fit=crop" },
    { name: "Chicken Hyderabadi Biryani (Full)", price: 420, image: "https://images.unsplash.com/photo-1596797038530-2c107229f2d3?w=400&h=300&fit=crop" },
    { name: "Fish Biryani", price: 420, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop" },
    { name: "Chicken Lollipop Biryani", price: 380, image: "https://images.unsplash.com/photo-1596797038530-2c107229f2d3?w=400&h=300&fit=crop" },
    { name: "Prawns Biryani", price: 460, image: "https://images.unsplash.com/photo-1617195737497-7ad67664b43a?w=400&h=300&fit=crop" },
    { name: "KK’s Special Biryani", price: 520, image: "https://images.unsplash.com/photo-1596797038530-2c107229f2d3?w=400&h=300&fit=crop" },
    { name: "Veg Biryani", price: 220, image: "https://images.unsplash.com/photo-1604908554049-0b1e0ef9b867?w=400&h=300&fit=crop" },
    { name: "Egg Biryani", price: 240, image: "https://images.unsplash.com/photo-1596797038530-2c107229f2d3?w=400&h=300&fit=crop" },
    { name: "Paneer Biryani", price: 300, image: "https://images.unsplash.com/photo-1604908554049-0b1e0ef9b867?w=400&h=300&fit=crop" },
    { name: "Mushroom Biryani", price: 280, image: "https://images.unsplash.com/photo-1604908554049-0b1e0ef9b867?w=400&h=300&fit=crop" }
  ],

  // NEW: Breads
  "Breads": [
    { name: "Tandoori Roti", price: 30, image: "https://images.unsplash.com/photo-1625944526225-7d8fb85bd90c?w=400&h=300&fit=crop" },
    { name: "Butter Roti", price: 35, image: "https://images.unsplash.com/photo-1625944526225-7d8fb85bd90c?w=400&h=300&fit=crop" },
    { name: "Plain Naan", price: 40, image: "https://images.unsplash.com/photo-1625944526225-7d8fb85bd90c?w=400&h=300&fit=crop" },
    { name: "Butter Naan", price: 50, image: "https://images.unsplash.com/photo-1625944526225-7d8fb85bd90c?w=400&h=300&fit=crop" },
    { name: "Garlic Naan", price: 60, image: "https://images.unsplash.com/photo-1576502200916-3808e07386a5?w=400&h=300&fit=crop" },
    { name: "Pudina Kulcha", price: 70, image: "https://images.unsplash.com/photo-1576502200916-3808e07386a5?w=400&h=300&fit=crop" },
    { name: "Masala Kulcha", price: 80, image: "https://images.unsplash.com/photo-1576502200916-3808e07386a5?w=400&h=300&fit=crop" },
    { name: "Paneer Kulcha", price: 120, image: "https://images.unsplash.com/photo-1576502200916-3808e07386a5?w=400&h=300&fit=crop" }
  ],

  // NEW: Soft Drinks & Refreshments (no alcohol)
  "Soft Drinks & Refreshments": [
    { name: "Fresh Lime Soda (Sweet)", price: 90, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop" },
    { name: "Fresh Lime Soda (Salt)", price: 90, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop" },
    { name: "Masala Soda", price: 100, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop" },
    { name: "Virgin Mojito", price: 150, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop" },
    { name: "Mango Lassi", price: 130, image: "https://images.unsplash.com/photo-1582456891925-7d8d2cbbdf3f?w=400&h=300&fit=crop" },
    { name: "Sweet Lassi", price: 110, image: "https://images.unsplash.com/photo-1582456891925-7d8d2cbbdf3f?w=400&h=300&fit=crop" },
    { name: "Buttermilk (Chaas)", price: 80, image: "https://images.unsplash.com/photo-1563841930606-67e2bce48b86?w=400&h=300&fit=crop" },
    { name: "Jal Jeera", price: 90, image: "https://images.unsplash.com/photo-1563841930606-67e2bce48b86?w=400&h=300&fit=crop" },
    { name: "Rose Milk", price: 120, image: "https://images.unsplash.com/photo-1613478223719-54f5f32a0a10?w=400&h=300&fit=crop" },
    { name: "Cold Coffee", price: 150, image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400&h=300&fit=crop" },
    { name: "Iced Tea (Lemon)", price: 130, image: "https://images.unsplash.com/photo-1463797221720-6b07e6426c24?w=400&h=300&fit=crop" },
    { name: "Iced Tea (Peach)", price: 140, image: "https://images.unsplash.com/photo-1463797221720-6b07e6426c24?w=400&h=300&fit=crop" },
    { name: "Mineral Water (1L)", price: 40, image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4b?w=400&h=300&fit=crop" },
    { name: "Coke/Pepsi (300ml)", price: 45, image: "https://images.unsplash.com/photo-1613478223719-54f5f32a0a10?w=400&h=300&fit=crop" }
  ]
};

// Extend tables to T01–T15
const tableData = Array.from({ length: 15 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return { number: `T${n}`, qrCode: `QR_T${n}_2024`, status: "AVAILABLE" };
});


async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data in dependency order
  console.log('🧹 Cleaning existing data...');
  await prisma.orderEvent.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.table.deleteMany();

  // Seed Categories and Menu Items
  console.log('📂 Seeding categories and menu items...');
  let displayOrder = 1;

  for (const [categoryName, items] of Object.entries(menuData)) {
    const category = await prisma.category.create({
      data: { name: categoryName, displayOrder: displayOrder++ }
    });

    for (const item of items) {
      await prisma.menuItem.create({
        data: {
          name: item.name,
          price: item.price,
          image: item.image,
          categoryId: category.id,
          isAvailable: true
        }
      });
    }
    console.log(`✅ Created category "${categoryName}" with ${items.length} items`);
  }

  // Seed Tables
  console.log('🪑 Seeding tables...');
  for (const t of tableData) {
    await prisma.table.create({ data: t });
  }
  console.log(`✅ Created ${tableData.length} tables`);

  // Summary
  const categoryCount = await prisma.category.count();
  const itemCount = await prisma.menuItem.count();
  const tableCount = await prisma.table.count();

  console.log('\n🎉 Database seeding completed!');
  console.log(`📊 Summary:
   - Categories: ${categoryCount}
   - Menu Items: ${itemCount}
   - Tables: ${tableCount}`);

    const tables = Array.from({ length: 15 }, (_, i) => {
    const n = String(i + 1).padStart(2, '0'); // 01..15
    return {
      number: `T${n}`,
      qrCode: `QR_T${n}_2024`,
      status: 'AVAILABLE',
      capacity: 4,
    };
  });

  for (const t of tables) {
    await prisma.table.upsert({
      where: { number: t.number },
      update: { qrCode: t.qrCode, status: t.status, capacity: t.capacity },
      create: t,
    });
  }

  console.log('✅ Seeded tables T01..T15');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });