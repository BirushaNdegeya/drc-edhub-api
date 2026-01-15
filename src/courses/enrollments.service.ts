import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Enrollment } from './enrollment.model';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectModel(Enrollment)
    private enrollmentModel: typeof Enrollment,
  ) {}

  async create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
    // Check if enrollment already exists
    const existing = await this.enrollmentModel.findOne({
      where: {
        userId: createEnrollmentDto.userId,
        courseId: createEnrollmentDto.courseId,
      },
    });

    if (existing) {
      throw new ConflictException('User is already enrolled in this course');
    }

    return this.enrollmentModel.create(createEnrollmentDto as any);
  }

  async findAll(): Promise<Enrollment[]> {
    return this.enrollmentModel.findAll({
      include: ['user', 'course'],
    });
  }

  async findOne(id: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentModel.findByPk(id, {
      include: ['user', 'course'],
    });
    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }
    return enrollment;
  }

  async update(
    id: string,
    updateEnrollmentDto: UpdateEnrollmentDto,
  ): Promise<Enrollment> {
    const enrollment = await this.findOne(id);
    await enrollment.update(updateEnrollmentDto);
    return enrollment;
  }

  async remove(id: string): Promise<void> {
    const enrollment = await this.findOne(id);
    await enrollment.destroy();
  }

  async findByUser(userId: string): Promise<Enrollment[]> {
    return this.enrollmentModel.findAll({
      where: { userId },
      include: ['course'],
    });
  }

  async findByCourse(courseId: string): Promise<Enrollment[]> {
    return this.enrollmentModel.findAll({
      where: { courseId },
      include: ['user'],
    });
  }
}
