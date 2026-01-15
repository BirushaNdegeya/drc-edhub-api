import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { School } from './school.model';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectModel(School)
    private schoolModel: typeof School,
  ) {}

  async create(createSchoolDto: CreateSchoolDto): Promise<School> {
    return this.schoolModel.create(createSchoolDto as any);
  }

  async findAll(): Promise<School[]> {
    return this.schoolModel.findAll();
  }

  async findOne(id: string): Promise<School> {
    const school = await this.schoolModel.findByPk(id);
    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    return school;
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto): Promise<School> {
    const school = await this.findOne(id);
    await school.update(updateSchoolDto);
    return school;
  }

  async remove(id: string): Promise<void> {
    const school = await this.findOne(id);
    await school.destroy();
  }
}
