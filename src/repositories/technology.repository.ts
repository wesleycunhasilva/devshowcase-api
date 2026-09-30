import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

export async function createTechnology(data: Prisma.TechnologyCreateInput) {
  return prisma.technology.create({ data });
}

export async function listTechnologies() {
  return prisma.technology.findMany({
    orderBy: { name: 'asc' },
  });
}
