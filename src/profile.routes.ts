import { Router } from 'express';
import { prisma } from './lib/prisma';

const router = Router();

// POST: Criar Perfil
router.post('/profiles', async (req, res) => {
  try {
    const { name, email, bio } = req.body;

    const profile = await prisma.profile.create({
      data: { name, email, bio },
    });

    return res.status(201).json(profile);
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao criar perfil. O e-mail pode já estar em uso.' });
  }
});

// GET: Listar Perfis
router.get('/profiles', async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany({
      include: { projects: true },
    });
    return res.json(profiles);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar perfis' });
  }
});

export default router;