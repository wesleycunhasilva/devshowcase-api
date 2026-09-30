import { Router } from 'express';
import { prisma } from './lib/prisma';

const router = Router();

// POST: Criar Tecnologia
router.post('/technologies', async (req, res) => {
  try {
    const { name } = req.body;

    const technology = await prisma.technology.create({
      data: { name },
    });

    return res.status(201).json(technology);
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao criar tecnologia' });
  }
});

// GET: Listar Tecnologias
router.get('/technologies', async (req, res) => {
  try {
    const technologies = await prisma.technology.findMany();
    return res.json(technologies);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar tecnologias' });
  }
});

export default router;