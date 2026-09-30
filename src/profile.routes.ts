import { Router } from 'express';
import { profileCreateSchema } from './dto/profile.dto';
import { createProfile, findProfileById, listProfiles } from './repositories/profile.repository';

const router = Router();

router.post('/profiles', async (req, res, next) => {
  try {
    const payload = profileCreateSchema.parse(req.body);
    const profile = await createProfile(payload);
    return res.status(201).json(profile);
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return res.status(400).json({
        message: error.errors[0]?.message ?? 'Dados inválidos para criação do perfil.',
      });
    }

    next(error);
  }
});

router.get('/profiles', async (_req, res, next) => {
  try {
    const profiles = await listProfiles();
    return res.json(profiles);
  } catch (error) {
    next(error);
  }
});

router.get('/profiles/:id', async (req, res, next) => {
  try {
    const profileId = Number(req.params.id);

    if (!Number.isInteger(profileId) || profileId <= 0) {
      return res.status(400).json({ message: 'O identificador do perfil deve ser um número válido.' });
    }

    const profile = await findProfileById(profileId);

    if (!profile) {
      return res.status(404).json({ message: 'Perfil não encontrado.' });
    }

    return res.json(profile);
  } catch (error) {
    next(error);
  }
});

export default router;