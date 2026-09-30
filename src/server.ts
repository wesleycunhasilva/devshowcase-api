import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// ==========================================
// 1. ROTAS DE TECNOLOGIAS
// ==========================================
app.post('/api/technologies', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "O campo 'name' é obrigatório." });
    }

    const technology = await prisma.technology.create({
      data: { name }
    });

    return res.status(201).json(technology);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/technologies', async (req, res) => {
  const technologies = await prisma.technology.findMany();
  return res.json(technologies);
});

// ==========================================
// 2. ROTAS DE PERFIS
// ==========================================
app.post('/api/profiles', async (req, res) => {
  try {
    const { name, email, bio } = req.body;
    const profile = await prisma.profile.create({
      data: { name, email, bio }
    });
    return res.status(201).json(profile);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/profiles', async (req, res) => {
  const profiles = await prisma.profile.findMany({
    include: { projects: true }
  });
  return res.json(profiles);
});

// GET /api/profiles/:id - Buscar perfil por ID
app.get('/api/profiles/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const profile = await prisma.profile.findUnique({
      where: { id },
      include: { projects: true }
    });

    if (!profile) {
      return res.status(404).json({ error: "Perfil não encontrado." });
    }

    return res.json(profile);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 3. ROTAS DE PROJETOS
// ==========================================
app.post('/api/projects', async (req, res) => {
  try {
    const { title, description, repositoryUrl, profileId } = req.body;
    const project = await prisma.project.create({
      data: { title, description, repositoryUrl, profileId: Number(profileId) }
    });
    return res.status(201).json(project);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/projects', async (req, res) => {
  const projects = await prisma.project.findMany({
    include: { profile: true, technologies: true }
  });
  return res.json(projects);
});

// ==========================================
// 4. ROTAS DE FEEDBACK (NOVA)
// ==========================================
app.post('/api/feedbacks', async (req, res) => {
  try {
    const { comment, rating, projectId } = req.body;

    if (!comment || rating === undefined || !projectId) {
      return res.status(400).json({ error: "Os campos 'comment', 'rating' e 'projectId' são obrigatórios." });
    }

    const feedback = await prisma.feedback.create({
      data: {
        comment,
        rating: Number(rating),
        projectId: Number(projectId)
      }
    });

    return res.status(201).json(feedback);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/feedbacks', async (req, res) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      include: { project: true }
    });
    return res.json(feedbacks);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando com Prisma na porta ${PORT}`);
})