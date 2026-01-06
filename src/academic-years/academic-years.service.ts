import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AcademicYear } from './academic-year.model';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from './dto/update-academic-year.dto';

@Injectable()
export class AcademicYearsService {
  constructor(
    @InjectModel(AcademicYear)
    private academicYearModel: typeof AcademicYear,
  ) {}

  async create(
    createAcademicYearDto: CreateAcademicYearDto,
  ): Promise<AcademicYear> {
    return this.academicYearModel.create(createAcademicYearDto as any);
  }

  async findAll(): Promise<AcademicYear[]> {
    return this.academicYearModel.findAll();
  }

  async findOne(id: string): Promise<AcademicYear> {
    const academicYear = await this.academicYearModel.findByPk(id);
    if (!academicYear) {
      throw new NotFoundException(`AcademicYear with ID ${id} not found`);
    }
    return academicYear;
  }

  async update(
    id: string,
    updateAcademicYearDto: UpdateAcademicYearDto,
  ): Promise<AcademicYear> {
    const academicYear = await this.findOne(id);
    await academicYear.update(updateAcademicYearDto);
    return academicYear;
  }

  async remove(id: string): Promise<void> {
    const academicYear = await this.findOne(id);
    await academicYear.destroy();
  }
}
