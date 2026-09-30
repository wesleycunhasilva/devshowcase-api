import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';

const projectRoutes = Router();
const projectController = new ProjectController();

projectRoutes.post('/', projectController.create);
projectRoutes.get('/', projectController.findAll);
projectRoutes.post('/:id/feedbacks', projectController.addFeedback);
projectRoutes.put('/:id/upvote', projectController.upvote);

export { projectRoutes };