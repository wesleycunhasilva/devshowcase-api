import { Router } from 'express';
import { profileRoutes } from './profile.routes';
import { technologyRoutes } from './technology.routes';
import { projectRoutes } from './project.routes';

const routes = Router();

routes.use('/profiles', profileRoutes);
routes.use('/technologies', technologyRoutes);
routes.use('/projects', projectRoutes);

export default routes;