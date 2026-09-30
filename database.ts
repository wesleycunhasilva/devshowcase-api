import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
// Adicionar após a criação das tabelas no database.ts
db.exec(`
  CREATE TABLE IF NOT EXISTS feedbacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment TEXT NOT NULL,
    rating INTEGER NOT NULL,
    projectId INTEGER NOT NULL,
    FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
  )
`);