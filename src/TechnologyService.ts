import { prisma } from '../database';
import { CreateTechnologyInput } from '../dtos/TechnologyDTO';
import { AppError } from '../errors/AppError';

export class TechnologyService {
  async create(data: CreateTechnologyInput) {
    const techExists = await prisma.technology.findUnique({
      where: { name: data.name },
    });

    if (techExists) {
      throw new AppError('Esta tecnologia já está cadastrada.');
    }

    const technology = await prisma.technology.create({
      data,
    });

    return technology;
  }

  async findAll() {
    const technologies = await prisma.technology.findMany();
    return technologies;
  }
}