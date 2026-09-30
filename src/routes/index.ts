import { Router, Request, Response } from 'express';
import { db } from './database';

export const routes = Router();

// Rota de Perfis
routes.post('/api/profiles', (req: Request, res: Response) => {
  const { name, email, bio } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios.' });
  }

  const stmt = db.prepare('INSERT INTO Profile (name, email, bio) VALUES (?, ?, ?)');
  
  try {
    const result = stmt.run(name, email, bio || null);
    return res.status(201).json({
      id: result.lastInsertRowid,
      name,
      email,
      bio
    });
  } catch (error: any) {
    return res.status(400).json({ error: 'E-mail já cadastrado ou erro no banco.' });
  }
});