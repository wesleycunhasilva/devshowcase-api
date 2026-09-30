import { Router } from 'express';
import { technologyCreateSchema } from './dto/technology.dto';
import { createTechnology, listTechnologies } from './repositories/technology.repository';

const router = Router();

router.post('/technologies', async (req, res, next) => {
  try {
    const payload = technologyCreateSchema.parse(req.body);
    const technology = await createTechnology({ name: payload.name });
    return res.status(201).json(technology);
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return res.status(400).json({
        message: error.errors[0]?.message ?? 'Dados inválidos para criação da tecnologia.',
      });
    }

    next(error);
  }
});

router.get('/technologies', async (_req, res, next) => {
  try {
    const technologies = await listTechnologies();
    return res.json(technologies);
  } catch (error) {
    next(error);
  }
});

export default router;