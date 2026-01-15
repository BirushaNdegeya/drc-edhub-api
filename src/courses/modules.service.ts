import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Module } from './module.model';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModulesService {
  constructor(
    @InjectModel(Module)
    private moduleModel: typeof Module,
  ) {}

  async create(createModuleDto: CreateModuleDto): Promise<Module> {
    return this.moduleModel.create(createModuleDto as any);
  }

  async findAll(): Promise<Module[]> {
    return this.moduleModel.findAll({
      include: ['course'],
    });
  }

  async findOne(id: string): Promise<Module> {
    const module = await this.moduleModel.findByPk(id, {
      include: ['course', 'lessons'],
    });
    if (!module) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }
    return module;
  }

  async update(id: string, updateModuleDto: UpdateModuleDto): Promise<Module> {
    const module = await this.findOne(id);
    await module.update(updateModuleDto);
    return module;
  }

  async remove(id: string): Promise<void> {
    const module = await this.findOne(id);
    await module.destroy();
  }

  async findByCourse(courseId: string): Promise<Module[]> {
    return this.moduleModel.findAll({
      where: { courseId },
      include: ['lessons'],
      order: [['orderIndex', 'ASC']],
    });
  }
}
