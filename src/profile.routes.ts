import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// 1. Criar Perfil (POST http://localhost:3000/api/profiles)
router.post('/profiles', async (req, res) => {
  try {
    const { name, email, bio } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' });
    }

    const profile = await prisma.profile.create({
      data: { name, email, bio }
    });

    return res.status(201).json(profile);
  } catch (error) {
    console.error('Erro ao criar perfil:', error);
    return res.status(500).json({ error: 'Erro ao criar perfil. O e-mail pode já estar cadastrado.' });
  }
});

// 2. Listar Todos os Perfis (GET http://localhost:3000/api/profiles)
router.get('/profiles', async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany();
    return res.json(profiles);
  } catch (error) {
    console.error('Erro ao buscar perfis:', error);
    return res.status(500).json({ error: 'Erro ao listar perfis.' });
  }
});

// 3. Buscar Perfil por ID (GET http://localhost:3000/api/profiles/:id)
router.get('/profiles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await prisma.profile.findUnique({
      where: { id: Number(id) }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Perfil não encontrado.' });
    }

    return res.json(profile);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar perfil.' });
  }
});

export default router;