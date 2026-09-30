import { Router } from 'express';
import { ProfileController } from '../controllers/ProfileController';

const profileRoutes = Router();
const profileController = new ProfileController();

profileRoutes.post('/', profileController.create);
profileRoutes.get('/:id', profileController.findById);

export { profileRoutes };