const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("meow1234", 10);

  const user = await prisma.user.upsert({
    where: { email: "saver@meowwallet.id" },
    update: {},
    create: {
      name: "Meow Saver",
      email: "saver@meowwallet.id",
      passwordHash,
      isDemoSeeded: true,
    },
  });

  const bca = await prisma.account.create({
    data: { userId: user.id, name: "BCA", type: "BANK", initialBalance: 6000000, currentBalance: 8500000 },
  });
  await prisma.account.create({
    data: { userId: user.id, name: "GoPay", type: "EWALLET", initialBalance: 500000, currentBalance: 500000 },
  });

  const incomeCats = ["Gaji", "Bonus", "Usaha", "Freelance", "Dividen", "Hadiah", "Pemasukan lainnya"];
  const expenseCats = ["Makanan", "Transportasi", "Belanja", "Tagihan", "Kesehatan", "Pendidikan", "Hiburan", "Kebutuhan pribadi", "Pengeluaran lainnya"];

  const createdCats = {};
  for (const name of incomeCats) {
    createdCats[name] = await prisma.category.create({ data: { userId: user.id, name, type: "INCOME" } });
  }
  for (const name of expenseCats) {
    createdCats[name] = await prisma.category.create({ data: { userId: user.id, name, type: "EXPENSE" } });
  }

  await prisma.transaction.createMany({
    data: [
      { userId: user.id, accountId: bca.id, categoryId: createdCats["Gaji"].id, type: "INCOME", amount: 4000000, title: "Gaji Bulanan", isDemo: true },
      { userId: user.id, accountId: bca.id, categoryId: createdCats["Belanja"].id, type: "EXPENSE", amount: 250000, title: "Belanja di Shopee", isDemo: true },
      { userId: user.id, accountId: bca.id, categoryId: createdCats["Makanan"].id, type: "EXPENSE", amount: 45000, title: "Makan Siang", isDemo: true },
    ],
  });

  await prisma.savingsGoal.createMany({
    data: [
      { userId: user.id, name: "Dana Darurat", targetAmount: 5000000, currentAmount: 4000000, deadline: new Date("2026-12-30"), isDemo: true },
      { userId: user.id, name: "Liburan Jepang", targetAmount: 5000000, currentAmount: 2250000, deadline: new Date("2027-03-31"), isDemo: true },
      { userId: user.id, name: "Beli Laptop", targetAmount: 10000000, currentAmount: 2000000, deadline: new Date("2027-06-30"), isDemo: true },
    ],
  });

  console.log("Seed MeowWallet berhasil dijalankan!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
