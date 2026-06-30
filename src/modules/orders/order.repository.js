import prisma from "../../lib/prisma.js";

const withBouquet = {
  bouquet: { select: { id: true, title: true, price: true } },
};

export function count() {
  return prisma.order.count();
}

export function findMany({ skip, take }) {
  return prisma.order.findMany({
    skip,
    take,
    orderBy: { createdAt: "desc" },
    include: withBouquet,
  });
}

export function findById(id) {
  return prisma.order.findUnique({ where: { id }, include: withBouquet });
}

export function create(data) {
  return prisma.order.create({ data, include: withBouquet });
}

export function update(id, data) {
  return prisma.order.update({ where: { id }, data, include: withBouquet });
}

export function remove(id) {
  return prisma.order.delete({ where: { id } });
}
