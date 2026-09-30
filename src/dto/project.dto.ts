import { z } from 'zod';

const technologyReferenceSchema = z.union([
  z.number().int().positive('O identificador da tecnologia deve ser um número positivo.'),
  z.string().trim().min(2, 'Cada tecnologia deve ter um nome válido.'),
]);

export const projectCreateSchema = z.object({
  title: z.string().trim().min(2, 'O título deve ter pelo menos 2 caracteres.'),
  description: z.string().trim().min(10, 'A descrição deve ter pelo menos 10 caracteres.'),
  repositoryUrl: z.string().url('A URL do repositório deve ser válida.'),
  deployUrl: z
    .string()
    .url('A URL de deploy deve ser válida.')
    .optional()
    .or(z.literal(''))
    .transform((value) => (value === '' ? undefined : value)),
  profileId: z.number().int().positive('O perfil do projeto deve ser informado.'),
  technologies: z.array(technologyReferenceSchema).optional().default([]),
});

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
