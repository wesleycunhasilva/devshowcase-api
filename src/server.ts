import express from 'express';
import cors from 'cors';
import { prisma } from './lib/prisma';

const app = express();

app.use(cors());
app.use(express.json());

// Rota de teste de status
app.get('/health', (req, res) => {
  return res.json({ status: 'OK', message: 'API DevShowcase rodando!' });
});

// Rota para listar perfis cadastrados (incluindo os projetos vinculados)
app.get('/profiles', async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany({
      include: { projects: true },
    });
    return res.json(profiles);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar perfis.' });
  }
});

// Rota para criar um novo perfil
app.post('/profiles', async (req, res) => {
  const { name, email, bio, githubUrl } = req.body;

  try {
    const profile = await prisma.profile.create({
      data: { name, email, bio, githubUrl },
    });
    return res.status(201).json(profile);
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao criar perfil. Verifique se o e-mail já está cadastrado.' });
  }
});

// Rota para cadastrar um projeto vinculado a um perfil
app.post('/projects', async (req, res) => {
  const { title, description, repositoryUrl, deployUrl, techStack, profileId } = req.body;

  try {
    const project = await prisma.project.create({
      data: {
        title,
        description,
        repositoryUrl,
        deployUrl,
        techStack,
        profileId,
      },
    });
    return res.status(201).json(project);
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao cadastrar projeto. Verifique se o profileId é válido.' });
  }
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});