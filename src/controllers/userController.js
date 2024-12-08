import prisma from "../../prisma/client.js";
import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import AppError from "../utils/AppError.js";
import { generateTokens } from "../utils/jwt.js";
import { addRefreshTokenToWhiteList } from "../services/refreshTokens.js";
import { setAuthCookies } from "../utils/setAuthCookies.js";
import { isEmailValidate } from "../utils/isEmailValidate.js";
import { validateUserInputs } from "../utils/validateUserInputs.js";

export const registerUser = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role = "USER",
    organizationId,
  } = req.body;

  try {
    validateUserInputs({ firstName, lastName, email, password });

    if (!isEmailValidate(email)) {
      throw new AppError("This is not a valid email. Try again!");
    }

    if (!firstName || !lastName || !email || !password) {
      throw new AppError("All fields are required", 403);
    }

    const isEmailAlreadyRegistered = await prisma.user.findUnique({
      where: { email: email },
    });

    if (isEmailAlreadyRegistered) {
      throw new AppError("Email already taken", 403);
    }

    if (!organizationId) {
      throw new AppError("An organization ID is required to register", 400);
    }

    const existingOrganization = await prisma.socialOrganization.findUnique({
      where: { id: organizationId },
    });

    if (!existingOrganization) {
      throw new AppError("The specified organization does not exist", 404);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // create the user and associate with the existing organization
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: role.toUpperCase(),
        organization: {
          connect: { id: organizationId },
        },
      },
    });

    // Generate tokens and store refresh token in whitelist
    const jti = randomUUID();
    const { accessToken, refreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhiteList({ jti, refreshToken, userId: user.id });

    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};
