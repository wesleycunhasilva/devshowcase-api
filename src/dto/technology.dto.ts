import { z } from 'zod';

export const technologyCreateSchema = z.object({
  name: z.string().trim().min(2, 'O nome da tecnologia deve ter pelo menos 2 caracteres.'),
});

export type TechnologyCreateInput = z.infer<typeof technologyCreateSchema>;
