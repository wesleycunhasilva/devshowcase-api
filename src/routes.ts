import { Router, Request, Response } from 'express';
import { prisma } from './database';

export const routes = Router();

/* ==========================================================================
   1. PERFIL (PROFILE)
   ========================================================================== */

// POST /api/profiles - Criar perfil
routes.post('/api/profiles', async (req: Request, res: Response) => {
  const { name, email, bio } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios.' });
  }

  try {
    const profile = await prisma.profile.create({
      data: { name, email, bio }
    });
    return res.status(201).json(profile);
  } catch (error: any) {
    return res.status(400).json({ error: 'Erro ao criar perfil. O e-mail pode já estar cadastrado.' });
  }
});

// GET /api/profiles/:id - Buscar perfil por ID com seus projetos
routes.get('/api/profiles/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const profile = await prisma.profile.findUnique({
      where: { id: Number(id) },
      include: { projects: true }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Perfil não encontrado.' });
    }

    return res.json(profile);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar perfil.' });
  }
});


/* ==========================================================================
   2. TECNOLOGIA (TECHNOLOGY)
   ========================================================================== */

// POST /api/technologies - Cadastrar tecnologia
routes.post('/api/technologies', async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'O nome da tecnologia é obrigatório.' });
  }

  try {
    const tech = await prisma.technology.create({
      data: { name }
    });
    return res.status(201).json(tech);
  } catch (error) {
    return res.status(400).json({ error: 'Tecnologia já cadastrada.' });
  }
});


/* ==========================================================================
   3. PROJETO (PROJECT)
   ========================================================================== */

// POST /api/projects - Cadastrar projeto vinculado a perfil
routes.post('/api/projects', async (req: Request, res: Response) => {
  const { title, description, repositoryUrl, profileId } = req.body;

  if (!title || !description || !repositoryUrl || !profileId) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const project = await prisma.project.create({
      data: {
        title,
        description,
        repositoryUrl,
        profileId: Number(profileId)
      }
    });
    return res.status(201).json(project);
  } catch (error) {
    return res.status(400).json({ error: 'Perfil associado não encontrado ou dados inválidos.' });
  }
});import { Router } from 'express';
import { prisma } from './lib/prisma'; // Ajuste o caminho para o arquivo onde você instancia o Prisma Client

const router = Router();

// POST /api/feedbacks - Cadastrar um feedback para um projeto
router.post('/feedbacks', async (req, res) => {
  try {
    const { comment, rating, projectId } = req.body;

    if (!comment || rating === undefined || !projectId) {
      return res.status(400).json({ error: 'Comentário, avaliação e ID do projeto são obrigatórios.' });
    }

    const feedback = await prisma.feedback.create({
      data: {
        comment,
        rating,
        projectId
      }
    });

    return res.status(201).json(feedback);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar feedback.' });
  }
});

export default router;