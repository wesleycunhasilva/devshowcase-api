import { Request, Response } from 'express';
import { prisma } from '../database';

export class ProfileController {
  async index(req: Request, res: Response) {
    const profiles = await prisma.profile.findMany();
    return res.json(profiles);
  }

  async create(req: Request, res: Response) {
    const { name, bio, github, linkedin } = req.body;

    const profile = await prisma.profile.create({
      data: { name, bio, github, linkedin },
    });

    return res.status(201).json(profile);
  }
}
