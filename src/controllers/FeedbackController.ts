import { Request, Response } from 'express';
import { prisma } from '../database';

export class FeedbackController {
  async index(req: Request, res: Response) {
    const feedbacks = await prisma.feedback.findMany();
    return res.json(feedbacks);
  }

  async create(req: Request, res: Response) {
    const { author, content, rating } = req.body;

    const feedback = await prisma.feedback.create({
      data: { author, content, rating },
    });

    return res.status(201).json(feedback);
  }
}
