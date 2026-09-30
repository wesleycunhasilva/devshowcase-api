import { prisma } from '../database';
import { CreateProfileInput } from '../dtos/ProfileDTO';
import { AppError } from '../errors/AppError';

export class ProfileService {
  async create(data: CreateProfileInput) {
    const profile = await prisma.profile.create({
      data,
    });
    return profile;
  }

  async findById(id: string) {
    const profile = await prisma.profile.findUnique({
      where: { id },
      include: {
        projects: true,
      },
    });

    if (!profile) {
      throw new AppError('Perfil não encontrado.', 404);
    }

    return profile;
  }
}