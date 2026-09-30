import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

export async function createProfile(data: Prisma.ProfileCreateInput) {
  return prisma.profile.create({
    data,
  });
}

export async function findProfileById(id: number) {
  return prisma.profile.findUnique({
    where: { id },
    include: {
      projects: {
        include: {
          technologies: true,
          feedbacks: true,
        },
      },
    },
  });
}

export async function listProfiles() {
  return prisma.profile.findMany({
    include: {
      projects: {
        include: {
          technologies: true,
          feedbacks: true,
        },
      },
    },
  });
}
