import prisma from "../../db/prisma.js";

export function findAll() {
  return prisma.feedback.findMany({ orderBy: { id: "asc" } });
}

export function findById(id) {
  return prisma.feedback.findUnique({ where: { id } });
}

export function create(data) {
  return prisma.feedback.create({ data });
}

export function update(id, data) {
  return prisma.feedback.update({ where: { id }, data });
}

export function remove(id) {
  return prisma.feedback.delete({ where: { id } });
}
