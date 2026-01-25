import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AcademicYear } from './academic-year.model';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from './dto/update-academic-year.dto';
import { Op } from 'sequelize';

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

  /**
   * Fast search for academic years
   * @param query - Search query (searches in name and province)
   * @param limit - Maximum number of results (default: 10)
   */
  async search(query: string, limit: number = 10): Promise<AcademicYear[]> {
    if (!query || query.trim() === '') {
      return [];
    }

    const searchTerm = `%${query.trim()}%`;
    
    return this.academicYearModel.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: searchTerm } },
          { province: { [Op.iLike]: searchTerm } },
        ],
      },
      limit,
      attributes: ['id', 'name', 'province'],
    });
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
