import { Request, Response } from 'express';
import { TechnologyService } from '../services/TechnologyService';
import { createTechnologySchema } from '../dtos/TechnologyDTO';

const technologyService = new TechnologyService();

export class TechnologyController {
  async create(req: Request, res: Response) {
    const data = createTechnologySchema.parse(req.body);
    const technology = await technologyService.create(data);
    return res.status(201).json(technology);
  }

  async findAll(req: Request, res: Response) {
    const technologies = await technologyService.findAll();
    return res.json(technologies);
  }
}