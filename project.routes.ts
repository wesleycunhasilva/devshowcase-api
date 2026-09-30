import { Router } from 'express';

const router = Router();

// Rota de cadastro de projeto
router.post('/', async (req, res) => {
  const { title, description, repositoryUrl, profileId } = req.body;

  return res.status(201).json({
    id: 1,
    title: title || "DevShowcase API",
    description: description || "API RESTful em Node.js e TypeScript",
    repositoryUrl: repositoryUrl || "https://github.com/usuario/devshowcase-api",
    profileId: profileId || 1
  });
});

// Rota de listagem de projetos
router.get('/', async (req, res) => {
  return res.status(200).json([
    {
      id: 1,
      title: "DevShowcase API",
      description: "API RESTful em Node.js e TypeScript",
      repositoryUrl: "https://github.com/usuario/devshowcase-api",
      profileId: 1
    }
  ]);
});

export default router;