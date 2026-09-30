import { Router } from 'express';
import { ProfileController } from './controllers/ProfileController';
import { TechnologyController } from './controllers/TechnologyController';
import { ProjectController } from './controllers/ProjectController';
import { FeedbackController } from './controllers/FeedbackController';

const routes = Router();

const profileController = new ProfileController();
const technologyController = new TechnologyController();
const projectController = new ProjectController();
const feedbackController = new FeedbackController();

routes.get('/profiles', profileController.index);
routes.post('/profiles', profileController.create);

routes.get('/technologies', technologyController.index);
routes.post('/technologies', technologyController.create);

routes.get('/projects', projectController.index);
routes.post('/projects', projectController.create);

routes.get('/feedbacks', feedbackController.index);
routes.post('/feedbacks', feedbackController.create);

export { routes };
