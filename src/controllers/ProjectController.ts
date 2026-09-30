import { Request, Response } from 'express';
import { prisma } from '../database';

export class ProjectController {
  async index(req: Request, res: Response) {
    const projects = await prisma.project.findMany({
      include: { technologies: true },
    });
    return res.json(projects);
  }

  async create(req: Request, res: Response) {
    const { title, description, repoUrl, deployUrl } = req.body;

    const project = await prisma.project.create({
      data: { title, description, repoUrl, deployUrl },
    });

    return res.status(201).json(project);
  }
}
