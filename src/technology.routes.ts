import { Router } from 'express';

const router = Router();

// Rota de cadastro de tecnologia
router.post('/', async (req, res) => {
  const { name } = req.body;

  return res.status(201).json({
    id: 1,
    name: name || "TypeScript"
  });
});

// Rota de listagem de tecnologias
router.get('/', async (req, res) => {
  return res.status(200).json([
    { id: 1, name: "TypeScript" }
  ]);
});

export default router;