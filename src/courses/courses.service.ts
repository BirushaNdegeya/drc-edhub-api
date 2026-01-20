import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Course } from './course.model';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateSchoolCourseDto } from './dto/create-school-course.dto';
import { AssignInstructorsDto } from './dto/assign-instructors.dto';
import { PublishCourseDto } from './dto/publish-course.dto';
import { CourseAssignment } from './course-assignment.model';
import { UsersService } from '../users/users.service';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course)
    private courseModel: typeof Course,
    @InjectModel(CourseAssignment)
    private courseAssignmentModel: typeof CourseAssignment,
    private usersService: UsersService,
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

  // School Admin Course Management

  async createSchoolCourse(
    schoolId: string,
    userId: string,
    createSchoolCourseDto: CreateSchoolCourseDto,
  ): Promise<Course> {
    // Verify user exists
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Create course
    const course = await this.courseModel.create({
      title: createSchoolCourseDto.title,
      slug: createSchoolCourseDto.slug,
      description: createSchoolCourseDto.description,
      durationWeeks: createSchoolCourseDto.durationWeeks,
      schoolId,
      createdById: userId,
      status: 'draft',
      published: false,
      levelId: createSchoolCourseDto.levelId,
    } as any);

    // Assign instructors if provided
    if (createSchoolCourseDto.instructorIds && createSchoolCourseDto.instructorIds.length > 0) {
      await this.assignInstructorsToCourse(
        course.id,
        createSchoolCourseDto.instructorIds,
      );
    }

    return this.findOne(course.id);
  }

  async assignInstructorsToCourse(
    courseId: string,
    instructorIds: string[],
  ): Promise<{ message: string; assignedCount: number }> {
    const course = await this.findOne(courseId);

    // Verify all instructors exist
    for (const instructorId of instructorIds) {
      const instructor = await this.usersService.findById(instructorId);
      if (!instructor) {
        throw new NotFoundException(`Instructor with ID ${instructorId} not found`);
      }
    }

    // Remove existing assignments
    await this.courseAssignmentModel.destroy({
      where: { courseId },
    });

    // Create new assignments
    for (const instructorId of instructorIds) {
      await this.courseAssignmentModel.create({
        courseId,
        instructorId,
      } as any);
    }

    return {
      message: `Assigned ${instructorIds.length} instructors to course`,
      assignedCount: instructorIds.length,
    };
  }

  async publishCourse(
    courseId: string,
    publishCourseDto: PublishCourseDto,
  ): Promise<Course> {
    const course = await this.findOne(courseId);

    await course.update({
      published: publishCourseDto.published,
      status: publishCourseDto.published ? 'published' : 'draft',
      publishedAt: publishCourseDto.published ? new Date() : null,
    } as any);

    return this.findOne(courseId);
  }

  async getSchoolCourses(schoolId: string): Promise<Course[]> {
    return this.courseModel.findAll({
      where: { schoolId },
      include: ['createdBy', 'assignedInstructors'],
    });
  }

  async getCourseInstructors(courseId: string): Promise<any[]> {
    const assignments = await this.courseAssignmentModel.findAll({
      where: { courseId },
      include: ['instructor'],
    });

    return assignments.map((assignment) => assignment.instructor);
  }
}
