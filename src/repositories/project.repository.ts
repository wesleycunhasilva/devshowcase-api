import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

export async function createProject(input: {
  title: string;
  description: string;
  repositoryUrl: string;
  deployUrl?: string;
  profileId: number;
  technologies?: Array<number | string>;
}) {
  const technologyReferences = input.technologies ?? [];
  const technologyIds = technologyReferences.filter((item): item is number => typeof item === 'number');
  const technologyNames = technologyReferences
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  const normalizedTechnologies = technologyIds.length > 0 || technologyNames.length > 0
    ? {
        connect: technologyIds.map((id) => ({ id })),
        connectOrCreate: technologyNames.map((name) => ({
          where: { name },
          create: { name },
        })),
      }
    : undefined;

  const data: Prisma.ProjectCreateInput = {
    title: input.title,
    description: input.description,
    repositoryUrl: input.repositoryUrl,
    ...(input.deployUrl ? { deployUrl: input.deployUrl } : {}),
    profile: {
      connect: { id: input.profileId },
    },
    ...(normalizedTechnologies ? { technologies: normalizedTechnologies } : {}),
  };

  return prisma.project.create({
    data,
    include: {
      profile: true,
      technologies: true,
      feedbacks: true,
    },
  });
}

export async function getProjectById(id: number) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      profile: true,
      technologies: true,
      feedbacks: true,
    },
  });
}

export async function listProjects(page: number, limit: number, technology?: string) {
  const skip = (page - 1) * limit;
  const where = technology
    ? {
        technologies: {
          some: {
            name: {
              contains: technology,
              mode: 'insensitive',
            },
          },
        },
      }
    : {};

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      skip,
      take: limit,
      include: {
        profile: true,
        technologies: true,
        feedbacks: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.project.count({ where }),
  ]);

  return {
    data: projects,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
