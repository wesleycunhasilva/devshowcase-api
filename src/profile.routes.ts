import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  return res.status(200).json([{ id: 1, name: "Perfil de Teste" }]);
});

export default router;