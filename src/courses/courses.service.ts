import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Course } from './course.model';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course)
    private courseModel: typeof Course,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    return this.courseModel.create(createCourseDto as any);
  }

  async findAll(): Promise<Course[]> {
    return this.courseModel.findAll({
      include: ['school', 'createdBy', 'instructor'],
    });
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseModel.findByPk(id, {
      include: ['school', 'createdBy', 'instructor', 'modules'],
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);
    await course.update(updateCourseDto);
    return course;
  }

  async remove(id: string): Promise<void> {
    const course = await this.findOne(id);
    await course.destroy();
  }

  async findBySchool(schoolId: string): Promise<Course[]> {
    return this.courseModel.findAll({
      where: { schoolId },
      include: ['createdBy', 'instructor'],
    });
  }

  async findByInstructor(instructorId: string): Promise<Course[]> {
    return this.courseModel.findAll({
      where: { instructorId },
      include: ['school', 'createdBy'],
    });
  }
}
