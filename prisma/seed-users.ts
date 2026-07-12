import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

const NON_ADMIN_ROLES = [3, 4, 5]; // Manager, Vendor, Customer
const FIRST_NAMES = [
  "Ahmed", "Mohamed", "Youssef", "Omar", "Ali", "Hassan", "Hussein", "Karim",
  "Amine", "Mehdi", "Sami", "Nadir", "Rayan", "Ilyas", "Adam", "Ismail",
  "Yassin", "Hamza", "Zakaria", "Bilal", "Ayoub", "Salah", "Walid", "Hicham",
  "Nassim", "Farid", "Malik", "Tariq", "Jamal", "Rashid", "Anas", "Khalid",
  "Saad", "Marwan", "Layla", "Fatima", "Aisha", "Nora", "Zineb", "Sara",
  "Yasmin", "Ines", "Mariam", "Sofia", "Lina", "Rania", "Amira", "Salma",
  "Dounia", "Kenza", "Malak", "Houda", "Nada", "Rim", "Imane", "Selma",
];

const LAST_NAMES = [
  "Benali", "Ziani", "Rahmani", "Belaid", "Bouzid", "Hamidi", "Fassi", "Cherif",
  "Mansouri", "Saidi", "Kaddouri", "Tazi", "El Fassi", "El Amrani", "Idrissi",
  "Alaoui", "Ouazzani", "Bennani", "Chraibi", "Berrada", "Mouline", "Sbihi",
  "Kacemi", "Toumi", "Messaoudi", "Nasri", "Boutaleb", "El Khayat", "Lamrani",
  "Mikou", "Benkirane", "Fikri", "Guedira", "Harir", "Jazouli", "Kabbaj",
  "Lahlou", "Moutaoukil", "Naji", "Qadiri",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log("Checking existing user count...");
  const existingCount = await prisma.user.count();
  console.log(`Existing users: ${existingCount}`);

  const toCreate = 200;
  const passwordHash = await argon2.hash("Password123!");

  const users = [];

  for (let i = 0; i < toCreate; i++) {
    const first_name = pick(FIRST_NAMES);
    const last_name = pick(LAST_NAMES);
    const email = `${first_name.toLowerCase()}.${last_name.toLowerCase()}${i + 1}@email.com`;
    const roleId = pick(NON_ADMIN_ROLES);

    users.push({
      email,
      password_hash: passwordHash,
      status: "active" as const,
      profile: {
        create: {
          first_name,
          last_name,
        },
      },
      user_role: {
        create: {
          role_id: roleId,
        },
      },
    });
  }

  console.log(`Inserting ${users.length} users...`);

  for (let i = 0; i < users.length; i++) {
    await prisma.user.create({ data: users[i] });
    if ((i + 1) % 50 === 0) {
      console.log(`  ${i + 1}/${users.length} inserted`);
    }
  }

  console.log("Done!");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
