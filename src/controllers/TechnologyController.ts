import { Request, Response } from 'express';
import { prisma } from '../database';

export class TechnologyController {
  async index(req: Request, res: Response) {
    const technologies = await prisma.technology.findMany();
    return res.json(technologies);
  }

  async create(req: Request, res: Response) {
    const { name, icon } = req.body;

    const technology = await prisma.technology.create({
      data: { name, icon },
    });

    return res.status(201).json(technology);
  }
}
