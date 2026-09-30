import { Router } from 'express';
import { TechnologyController } from '../controllers/TechnologyController';

const technologyRoutes = Router();
const technologyController = new TechnologyController();

technologyRoutes.post('/', technologyController.create);
technologyRoutes.get('/', technologyController.findAll);

export { technologyRoutes };