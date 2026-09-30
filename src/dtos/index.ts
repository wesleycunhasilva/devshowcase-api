import { z } from 'zod';

// DTO para Criação de Perfil (Profile)
export const CreateProfileDTO = z.object({
  name: z.string().min(1, 'O nome é obrigatório.'),
  email: z.string().email('E-mail em formato inválido.'),
  bio: z.string().optional(),
});

// DTO para Criação de Tecnologia (Technology)
export const CreateTechnologyDTO = z.object({
  name: z.string().min(1, 'O nome da tecnologia é obrigatório.'),
});

// DTO para Criação de Projeto (Project)
export const CreateProjectDTO = z.object({
  title: z.string().min(1, 'O título é obrigatório.'),
  description: z.string().min(1, 'A descrição é obrigatória.'),
  repositoryUrl: z.string().url('A URL do repositório deve ser válida.'),
  profileId: z.number().int('O ID do perfil deve ser um número inteiro.'),
  technologyIds: z.array(z.number().int()).optional(),
});