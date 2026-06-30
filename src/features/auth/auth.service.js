import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { config } from "../../config/env.js";
import { HTTP_STATUS } from "../../constants/httpStatus.js";
import { MESSAGES } from "../../constants/messages.js";
import prisma from "../../db/prisma.js";
import { HttpError } from "../../helpers/HttpError.js";

const SALT_ROUNDS = 10;

// Provision (or refresh) the admin account from env on startup. The plain
// password never lands in the DB — only its bcrypt hash.
export async function ensureAdminUser() {
  if (!config.admin.password) {
    console.warn("ADMIN_PASSWORD not set — admin user was not provisioned.");
    return;
  }

  const passwordHash = await bcrypt.hash(config.admin.password, SALT_ROUNDS);
  await prisma.user.upsert({
    where: { username: config.admin.username },
    update: { passwordHash, role: "admin" },
    create: { username: config.admin.username, passwordHash, role: "admin" },
  });
  console.log(`Admin user ready: ${config.admin.username}`);
}

export async function login({ username, password }) {
  const user = await prisma.user.findUnique({ where: { username } });
  // Same error whether the user is missing or the password is wrong — don't
  // leak which usernames exist.
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new HttpError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.invalidCredentials);
  }

  const token = jwt.sign({ sub: user.id, username: user.username, role: user.role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

  return { token, user: { id: user.id, username: user.username, role: user.role } };
}
