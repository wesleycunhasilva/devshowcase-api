import { Router } from 'express';
import { prisma } from './lib/prisma';
import { projectCreateSchema } from './dto/project.dto';
import { createProject, listProjects } from './repositories/project.repository';

const router = Router();

router.post('/projects', async (req, res, next) => {
  try {
    const payload = projectCreateSchema.parse(req.body);

    const profileExists = await prisma.profile.findUnique({ where: { id: payload.profileId } });
    if (!profileExists) {
      return res.status(404).json({ message: 'Perfil informado não encontrado.' });
    }

    const project = await createProject({
      title: payload.title,
      description: payload.description,
      repositoryUrl: payload.repositoryUrl,
      deployUrl: payload.deployUrl,
      profileId: payload.profileId,
      technologies: payload.technologies,
    });

    return res.status(201).json(project);
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return res.status(400).json({
        message: error.errors[0]?.message ?? 'Dados inválidos para criação do projeto.',
      });
    }

    next(error);
  }
});

router.post('/projects/:id/feedbacks', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const projectId = Number(id);

    if (!Number.isInteger(projectId) || projectId <= 0) {
      return res.status(400).json({ message: 'O identificador do projeto deve ser um número válido.' });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'A nota (rating) deve ser um número entre 1 e 5.' });
    }

    const projectExists = await prisma.project.findUnique({ where: { id: projectId } });
    if (!projectExists) {
      return res.status(404).json({ message: 'Projeto não encontrado.' });
    }

    await prisma.feedback.create({
      data: {
        rating: Number(rating),
        comment: comment ?? '',
        projectId,
      },
    });

    const aggregate = await prisma.feedback.aggregate({
      where: { projectId },
      _avg: { rating: true },
    });

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        averageRating: aggregate._avg.rating ?? 0,
      },
      include: { feedbacks: true, technologies: true, profile: true },
    });

    return res.status(201).json(updatedProject);
  } catch (error) {
    next(error);
  }
});

router.put('/projects/:id/upvote', async (req, res, next) => {
  try {
    const projectId = Number(req.params.id);
    if (!Number.isInteger(projectId) || projectId <= 0) {
      return res.status(400).json({ message: 'O identificador do projeto deve ser um número válido.' });
    }

    const projectExists = await prisma.project.findUnique({ where: { id: projectId } });
    if (!projectExists) {
      return res.status(404).json({ message: 'Projeto não encontrado.' });
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

router.get('/projects', async (req, res, next) => {
  try {
    const { page = '1', limit = '10', technology } = req.query;
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));

    const result = await listProjects(pageNumber, limitNumber, technology ? String(technology) : undefined);
    return res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;