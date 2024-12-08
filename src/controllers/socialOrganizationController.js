import prisma from "../../prisma/client.js";
import { addRefreshTokenToWhiteList } from "../services/refreshTokens.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import { setAuthCookies } from "../utils/setAuthCookies.js";
import { generateTokens } from "../utils/jwt.js";

export const createSocialOrganizationWithUser = async (req, res, next) => {
  const {
    name,
    contactPerson,
    email,
    firstName,
    lastName,
    phone,
    address,
    qualifications,
    categories,
    password,
  } = req.body;

  if (!name || !email || !categories || categories.length === 0 || !password) {
    return next(
      new AppError("All fields are required, including user credentials", 400)
    );
  }

  try {
    const existingOrganization = await prisma.socialOrganization.findUnique({
      where: { email },
    });

    if (existingOrganization) {
      throw new AppError(
        "This email is already taken for an organization",
        403
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //transactions
    const newOrganization = await prisma.$transaction(async (prisma) => {
      const organization = await prisma.socialOrganization.create({
        data: {
          name,
          contactPerson,
          email,
          phone,
          address,
          qualifications,
          categories: {
            create: categories.map((categoryId) => ({
              categoryId: parseInt(categoryId),
            })),
          },
        },
        include: {
          categories: {
            select: {
              id: true,
              categoryId: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      const user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          password: hashedPassword,
          role: "USER",
          organizationId: organization.id,
        },
      });

      return { organization, user };
    });

    // Generate Tokens
    const jti = randomUUID();
    const { accessToken, refreshToken } = generateTokens(
      newOrganization.user,
      jti
    );

    // Store refresh token in whitelist
    await addRefreshTokenToWhiteList({
      jti,
      refreshToken,
      userId: newOrganization.user.id,
    });

    // Set Auth Cookies (optional)
    setAuthCookies(res, accessToken, refreshToken);

    res.status(201).json({
      message: "Social organization and user registered successfully",
      organization: newOrganization.organization,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const createSocialOrganization = async (req, res, next) => {
  const {
    name,
    contactPerson,
    email,
    phone,
    address,
    qualifications,
    categories,
  } = req.body;

  if (!name || !email || !categories || categories.length === 0) {
    return next(
      new AppError("Name, email, and at least one category are required", 400)
    );
  }
  try {
    const newOrganization = await prisma.socialOrganization.create({
      data: {
        name,
        contactPerson,
        email,
        phone,
        address,
        qualifications,
        categories: {
          create: categories.map((categoryId) => ({
            categoryId: parseInt(categoryId),
          })),
        },
      },
      include: {
        categories: true,
      },
    });
    res.status(201).json(newOrganization);
  } catch (error) {
    next(error);
  }
};

export const getAllSocialOrganizations = async (req, res, next) => {
  try {
    const socialOrganizations = await prisma.socialOrganization.findMany();
    res.status(201).json(socialOrganizations);
  } catch (error) {
    res.status(404).json({ message: "Problem to find organizations" });
    next(error);
  }
};

export const getSocialOrganizationById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const socialOrganization = await prisma.socialOrganization.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    res.status(201).json(socialOrganization);
  } catch (error) {
    next(error);
  }
};

export const updateSocialOrganization = async (req, res, next) => {
  const { id } = req.params;
  const { name, contactPerson, email, phone, address, qualifications } =
    req.body;
  try {
    const updatedSocialOrganization = await prisma.socialOrganization.update({
      where: {
        id: parseInt(id),
      },
      data: { name, contactPerson, email, phone, address, qualifications },
    });

    res.status(201).json(updatedSocialOrganization);
  } catch (error) {
    next(error);
  }
};

export const deleteSocialOrganization = async (req, res, next) => {
  const { id } = req.params;

  try {
    await prisma.socialOrganization.delete({ where: { id: parseInt(id) } });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
