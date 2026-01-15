import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CourseAssignment } from './course-assignment.model';
import { Course } from './course.model';
import { CreateCourseAssignmentDto } from './dto/create-course-assignment.dto';
import { UpdateCourseAssignmentDto } from './dto/update-course-assignment.dto';

@Injectable()
export class CourseAssignmentsService {
  constructor(
    @InjectModel(CourseAssignment)
    private courseAssignmentModel: typeof CourseAssignment,
    @InjectModel(Course)
    private courseModel: typeof Course,
  ) {}

  async create(createCourseAssignmentDto: CreateCourseAssignmentDto): Promise<CourseAssignment> {
    // Check if assignment already exists
    const existing = await this.courseAssignmentModel.findOne({
      where: {
        courseId: createCourseAssignmentDto.courseId,
        instructorId: createCourseAssignmentDto.instructorId,
      },
    });

    if (existing) {
      throw new ConflictException('Instructor is already assigned to this course');
    }

    const assignment = await this.courseAssignmentModel.create(createCourseAssignmentDto as any);
    
    // Update course.instructorId if it's null
    const course = await this.courseModel.findByPk(createCourseAssignmentDto.courseId);
    if (course && !course.instructorId) {
      course.instructorId = createCourseAssignmentDto.instructorId;
      await course.save();
    }

    return assignment;
  }

  async findAll(): Promise<CourseAssignment[]> {
    return this.courseAssignmentModel.findAll({
      include: ['course', 'instructor', 'assignedBy'],
    });
  }

  async findOne(id: string): Promise<CourseAssignment> {
    const assignment = await this.courseAssignmentModel.findByPk(id, {
      include: ['course', 'instructor', 'assignedBy'],
    });
    if (!assignment) {
      throw new NotFoundException(`CourseAssignment with ID ${id} not found`);
    }
    return assignment;
  }

  async update(id: string, updateCourseAssignmentDto: UpdateCourseAssignmentDto): Promise<CourseAssignment> {
    const assignment = await this.findOne(id);
    await assignment.update(updateCourseAssignmentDto);
    return assignment;
  }

  async remove(id: string): Promise<void> {
    const assignment = await this.findOne(id);
    await assignment.destroy();
  }

  async findByCourse(courseId: string): Promise<CourseAssignment[]> {
    return this.courseAssignmentModel.findAll({
      where: { courseId },
      include: ['instructor', 'assignedBy'],
    });
  }

  async findByInstructor(instructorId: string): Promise<CourseAssignment[]> {
    return this.courseAssignmentModel.findAll({
      where: { instructorId },
      include: ['course', 'assignedBy'],
    });
  }
}
