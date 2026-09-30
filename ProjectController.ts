import { Request, Response } from 'express';
import { ProjectService } from '../services/ProjectService';
import { createProjectSchema, createFeedbackSchema } from '../dtos/ProjectDTO';

const projectService = new ProjectService();

export class ProjectController {
  async create(req: Request, res: Response) {
    const data = createProjectSchema.parse(req.body);
    const project = await projectService.create(data);
    return res.status(201).json(project);
  }

  async findAll(req: Request, res: Response) {
    const { technologyId, page, limit } = req.query;
    const projects = await projectService.findAll(
      technologyId as string,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10
    );
    return res.json(projects);
  }

  async addFeedback(req: Request, res: Response) {
    const { id } = req.params;
    const data = createFeedbackSchema.parse(req.body);
    const project = await projectService.addFeedback(id, data);
    return res.status(201).json(project);
  }

  async upvote(req: Request, res: Response) {
    const { id } = req.params;
    const project = await projectService.upvote(id);
    return res.json(project);
  }
}