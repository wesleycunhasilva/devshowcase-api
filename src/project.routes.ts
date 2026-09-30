import { Router } from 'express';
import { prisma } from './lib/prisma';

const router = Router();

// PUT: Incrementar Upvote
router.put('/projects/:id/upvote', async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.update({
      where: { id: Number(id) },
      data: {
        upvotes: {
          increment: 1,
        },
      },
    });

    return res.json(project);
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao registrar upvote' });
  }
});

// GET: Listar Projetos (com paginação opcional)
router.get('/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        feedbacks: true,
        technologies: true,
      },
    });
    return res.json(projects);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar projetos' });
  }
});

export default router;