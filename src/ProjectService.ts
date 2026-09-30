import { prisma } from '../database';
import { CreateProjectInput, CreateFeedbackInput } from '../dtos/ProjectDTO';
import { AppError } from '../errors/AppError';

export class ProjectService {
  async create(data: CreateProjectInput) {
    const profile = await prisma.profile.findUnique({
      where: { id: data.profileId },
    });

    if (!profile) {
      throw new AppError('Perfil associado não encontrado.', 404);
    }

    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        repositoryUrl: data.repositoryUrl,
        profileId: data.profileId,
        technologies: data.technologyIds
          ? { connect: data.technologyIds.map(id => ({ id })) }
          : undefined,
      },
      include: {
        technologies: true,
      },
    });

    return project;
  }

  async findAll(technologyId?: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const where = technologyId
      ? {
          technologies: {
            some: {
              id: technologyId,
            },
          },
        }
      : {};

    const projects = await prisma.project.findMany({
      where,
      skip,
      take: Number(limit),
      include: {
        technologies: true,
        profile: true,
      },
    });

    return projects;
  }

  async addFeedback(projectId: string, data: CreateFeedbackInput) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { feedbacks: true },
    });

    if (!project) {
      throw new AppError('Projeto não encontrado.', 404);
    }

    await prisma.feedback.create({
      data: {
        rating: data.rating,
        comment: data.comment,
        projectId,
      },
    });

    // Recalcular a nota média
    const allFeedbacks = [...project.feedbacks, { rating: data.rating }];
    const sum = allFeedbacks.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = Number((sum / allFeedbacks.length).toFixed(2));

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { averageRating },
      include: { feedbacks: true },
    });

    return updatedProject;
  }

  async upvote(projectId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new AppError('Projeto não encontrado.', 404);
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        upvotes: {
          increment: 1,
        },
      },
    });

    return updatedProject;
  }
}