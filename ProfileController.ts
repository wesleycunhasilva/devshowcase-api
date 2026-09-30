import { Request, Response } from 'express';
import { ProfileService } from '../services/ProfileService';
import { createProfileSchema } from '../dtos/ProfileDTO';

const profileService = new ProfileService();

export class ProfileController {
  async create(req: Request, res: Response) {
    const data = createProfileSchema.parse(req.body);
    const profile = await profileService.create(data);
    return res.status(201).json(profile);
  }

  async findById(req: Request, res: Response) {
    const { id } = req.params;
    const profile = await profileService.findById(id);
    return res.json(profile);
  }
}