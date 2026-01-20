import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateSchoolCourseDto } from './dto/create-school-course.dto';
import { AssignInstructorsDto } from './dto/assign-instructors.dto';
import { PublishCourseDto } from './dto/publish-course.dto';
import { AdminGuard } from '../common/guards/admin.guard';
import { SchoolAdminGuard } from '../common/guards/school-admin.guard';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'Course created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses or filter by school/instructor' })
  @ApiQuery({
    name: 'schoolId',
    required: false,
    description: 'Filter courses by school UUID',
  })
  @ApiQuery({
    name: 'instructorId',
    required: false,
    description: 'Filter courses by instructor UUID',
  })
  @ApiResponse({ status: 200, description: 'List of courses' })
  findAll(
    @Query('schoolId') schoolId?: string,
    @Query('instructorId') instructorId?: string,
  ) {
    if (schoolId) {
      return this.coursesService.findBySchool(schoolId);
    }
    if (instructorId) {
      return this.coursesService.findByInstructor(instructorId);
    }
    return this.coursesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course by ID' })
  @ApiResponse({ status: 200, description: 'Course found' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Update course by ID' })
  @ApiResponse({ status: 200, description: 'Course updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Delete course by ID' })
  @ApiResponse({ status: 200, description: 'Course deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.remove(id);
  }

  // School Admin Course Management Endpoints

  @Post('school/create')
  @UseGuards(SchoolAdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Create a course for school (School admin only)' })
  @ApiResponse({ status: 201, description: 'Course created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - School admin token required' })
  async createSchoolCourse(
    @Request() req: any,
    @Body() createSchoolCourseDto: CreateSchoolCourseDto,
  ) {
    return this.coursesService.createSchoolCourse(
      req.user.schoolId,
      req.user.id,
      createSchoolCourseDto,
    );
  }

  @Post(':id/assign-instructors')
  @UseGuards(SchoolAdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Assign multiple instructors to a course (School admin only)' })
  @ApiResponse({ status: 200, description: 'Instructors assigned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - School admin token required' })
  @ApiResponse({ status: 404, description: 'Course or instructor not found' })
  async assignInstructors(
    @Param('id', ParseUUIDPipe) courseId: string,
    @Body() assignInstructorsDto: AssignInstructorsDto,
  ) {
    return this.coursesService.assignInstructorsToCourse(
      courseId,
      assignInstructorsDto.instructorIds,
    );
  }

  @Patch(':id/publish')
  @UseGuards(SchoolAdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Publish or unpublish a course (School admin only)' })
  @ApiResponse({ status: 200, description: 'Course published/unpublished successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - School admin token required' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async publishCourse(
    @Param('id', ParseUUIDPipe) courseId: string,
    @Body() publishCourseDto: PublishCourseDto,
  ) {
    return this.coursesService.publishCourse(courseId, publishCourseDto);
  }

  @Get('school/my-courses')
  @UseGuards(SchoolAdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get all courses for school (School admin only)' })
  @ApiResponse({ status: 200, description: 'List of school courses' })
  @ApiResponse({ status: 401, description: 'Unauthorized - School admin token required' })
  async getSchoolCourses(@Request() req: any) {
    return this.coursesService.getSchoolCourses(req.user.schoolId);
  }

  @Get(':id/instructors')
  @UseGuards(SchoolAdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get all instructors assigned to a course (School admin only)' })
  @ApiResponse({ status: 200, description: 'List of instructors' })
  @ApiResponse({ status: 401, description: 'Unauthorized - School admin token required' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async getCourseInstructors(@Param('id', ParseUUIDPipe) courseId: string) {
    return this.coursesService.getCourseInstructors(courseId);
  }
}
