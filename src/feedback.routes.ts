import { Router } from 'express';
import { prisma } from './lib/prisma';

const router = Router();

router.post('/feedbacks', async (req, res) => {
  try {
    const { comment, rating, projectId } = req.body;

    if (!comment || rating === undefined || !projectId) {
      return res.status(400).json({ error: 'Comentário, avaliação e ID do projeto são obrigatórios.' });
    }

    const feedback = await prisma.feedback.create({
      data: {
        comment,
        rating,
        projectId
      }
    });

    return res.status(201).json(feedback);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar feedback.' });
  }
});

export default router;