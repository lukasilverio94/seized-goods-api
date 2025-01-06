import bcrypt from "bcrypt";
import prisma from "../../prisma/client.js";

export const bootstrapAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error(
      "Admin email and password must be set in environment variables."
    );
    return;
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        firstName: "Super",
        lastName: "Admin",
        email: adminEmail,
        password: hashedPassword,
        isVerified: true,
        role: "ADMIN",
      },
    });
    console.log("Admin user bootstrapped successfully!");
  } else {
    console.log("Admin user already exists.");
  }
};

bootstrapAdmin().catch((error) => {
  console.error("Error bootstrapping admin:", error);
});
