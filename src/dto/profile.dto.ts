import { z } from 'zod';

export const profileCreateSchema = z.object({
  name: z.string().trim().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  email: z.string().trim().email('Informe um e-mail válido.'),
  bio: z
    .string()
    .trim()
    .max(500, 'A bio deve ter no máximo 500 caracteres.')
    .optional()
    .transform((value) => (value === undefined ? undefined : value || undefined)),
});

export type ProfileCreateInput = z.infer<typeof profileCreateSchema>;
