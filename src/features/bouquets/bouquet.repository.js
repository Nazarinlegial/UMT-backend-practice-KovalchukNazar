// Data-access layer for bouquets: the ONLY place that talks to prisma.bouquet.
import prisma from "../../db/prisma.js";

export function count(where = {}) {
  return prisma.bouquet.count({ where });
}

export function findMany({ where = {}, skip, take, orderBy = { id: "asc" } }) {
  return prisma.bouquet.findMany({ where, skip, take, orderBy });
}

export function findById(id) {
  return prisma.bouquet.findUnique({ where: { id } });
}

export function findFavorites() {
  return prisma.bouquet.findMany({ where: { favorite: true }, orderBy: { id: "asc" } });
}

export function create(data) {
  return prisma.bouquet.create({ data });
}

export function update(id, data) {
  return prisma.bouquet.update({ where: { id }, data });
}

export function remove(id) {
  return prisma.bouquet.delete({ where: { id } });
}
