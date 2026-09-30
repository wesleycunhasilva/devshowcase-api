import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();
export const projectRoutes = Router();

// Validação com Zod para criação de Projeto
const createProjectSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  description: z.string().min(1, 'A descrição é obrigatória'),
  repositoryUrl: z.string().url('URL do repositório inválida'),
  deployUrl: z.string().url('URL de deploy inválida').optional().or(z.literal('')),
  profileId: z.number().int('O ID do perfil deve ser um número inteiro'),
  technologyIds: z.array(z.number()).optional()
});

// Validação com Zod para Feedback
const createFeedbackSchema = z.object({
  rating: z.number().int().min(1, 'A nota mínima é 1').max(5, 'A nota máxima é 5'),
  comment: z.string().min(1, 'O comentário é obrigatório')
});

// 1. GET /api/projects (Com Paginação e Filtro por Tecnologia)
projectRoutes.get('/projects', async (req, res, next) => {
  try {
    const { tech, page = '1', limit = '10' } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const where: any = {};
    if (tech) {
      where.technologies = {
        some: {
          name: {
            contains: tech as string,
            mode: 'insensitive'
          }
        }
      };
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limitNumber,
        include: {
          profile: true,
          technologies: true,
          feedbacks: true
        }
      }),
      prisma.project.count({ where })
    ]);

    return res.json({
      data: projects,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalItems: total,
        totalPages: Math.ceil(total / limitNumber)
      }
    });
  } catch (error) {
    next(error);
  }
});

// 2. POST /api/projects (Cadastrar Projeto)
projectRoutes.post('/projects', async (req, res, next) => {
  try {
    const data = createProjectSchema.parse(req.body);

    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        repositoryUrl: data.repositoryUrl,
        deployUrl: data.deployUrl || null,
        profileId: data.profileId,
        technologies: data.technologyIds ? {
          connect: data.technologyIds.map(id => ({ id }))
        } : undefined
      },
      include: {
        technologies: true,
        profile: true
      }
    });

    return res.status(201).json(project);
  } catch (error) {
    next(error);
  }
});

// 3. PUT /api/projects/:id/upvote (Atualizar curtidas/estrelas)
projectRoutes.put('/projects/:id/upvote', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const projectExists = await prisma.project.findUnique({ where: { id } });
    if (!projectExists) {
      const err: any = new Error('Projeto não encontrado.');
      err.statusCode = 404;
      throw err;
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        upvotes: {
          increment: 1
        }
      }
    });

    return res.json({
      message: 'Upvote computado com sucesso!',
      upvotes: updatedProject.upvotes,
      project: updatedProject
    });
  } catch (error) {
    next(error);
  }
});

// 4. POST /api/projects/:id/feedbacks (Cadastrar feedback e recalcular média)
projectRoutes.post('/projects/:id/feedbacks', async (req, res, next) => {
  try {
    const projectId = parseInt(req.params.id, 10);
    const { rating, comment } = createFeedbackSchema.parse(req.body);

    const projectExists = await prisma.project.findUnique({
      where: { id: projectId },
      include: { feedbacks: true }
    });

    if (!projectExists) {
      const err: any = new Error('Projeto não encontrado.');
      err.statusCode = 404;
      throw err;
    }

    // Cria o feedback
    const feedback = await prisma.feedback.create({
      data: {
        rating,
        comment,
        projectId
      }
    });

    // Busca todos os feedbacks atualizados do projeto para recalcular a média
    const allFeedbacks = await prisma.feedback.findMany({
      where: { projectId }
    });

    const sumRatings = allFeedbacks.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = Number((sumRatings / allFeedbacks.length).toFixed(2));

    // Atualiza a nota média no projeto
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { averageRating },
      include: { feedbacks: true }
    });

    return res.status(201).json({
      message: 'Feedback adicionado com sucesso!',
      feedback,
      project: updatedProject
    });
  } catch (error) {
    next(error);
  }
});