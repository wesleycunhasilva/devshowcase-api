import { Router } from 'express';
import { prisma } from './lib/prisma';

const router = Router();

// 1. POST: Cadastrar feedback e atualizar nota média (averageRating)
router.post('/projects/:id/feedbacks', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const projectId = Number(id);

    // Validação de nota (1 a 5)
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'A nota (rating) deve ser um número entre 1 e 5.' });
    }

    // Verificar se o projeto existe
    const projectExists = await prisma.project.findUnique({ where: { id: projectId } });
    if (!projectExists) {
      return res.status(404).json({ error: 'Projeto não encontrado.' });
    }

    // Criar o feedback
    await prisma.feedback.create({
      data: {
        rating: Number(rating),
        comment,
        projectId,
      },
    });

    // Recalcular a média das notas do projeto
    const aggregate = await prisma.feedback.aggregate({
      where: { projectId },
      _avg: { rating: true },
    });

    const newAverage = aggregate._avg.rating || 0;

    // Atualizar a nota média no projeto
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { averageRating: newAverage },
      include: { feedbacks: true },
    });

    return res.status(201).json(updatedProject);
  } catch (error) {
    next(error);
  }
});

// 2. PUT: Incrementar Upvote
router.put('/projects/:id/upvote', async (req, res, next) => {
  try {
    const { id } = req.params;
    const projectId = Number(id);

    const projectExists = await prisma.project.findUnique({ where: { id: projectId } });
    if (!projectExists) {
      return res.status(404).json({ error: 'Projeto não encontrado.' });
    }

    const project = await prisma.project.update({
      where: { id: projectId },
      data: { upvotes: { increment: 1 } },
    });

    return res.json(project);
  } catch (error) {
    next(error);
  }
});

// 3. GET: Listar Projetos com Filtro por Tecnologia e Paginação
router.get('/projects', async (req, res, next) => {
  try {
    const { page = '1', limit = '10', technology } = req.query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    // Filtro condicional por tecnologia
    const whereCondition = technology
      ? {
          technologies: {
            some: {
              name: {
                contains: String(technology),
                mode: 'insensitive' as const,
              },
            },
          },
        }
      : {};

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: whereCondition,
        skip,
        take: limitNum,
        include: {
          feedbacks: true,
          technologies: true,
        },
      }),
      prisma.project.count({ where: whereCondition }),
    ]);

    return res.json({
      data: projects,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;