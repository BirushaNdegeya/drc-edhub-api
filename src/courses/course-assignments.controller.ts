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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CourseAssignmentsService } from './course-assignments.service';
import { CreateCourseAssignmentDto } from './dto/create-course-assignment.dto';
import { UpdateCourseAssignmentDto } from './dto/update-course-assignment.dto';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiTags('Course Assignments')
@Controller('course-assignments')
export class CourseAssignmentsController {
  constructor(
    private readonly courseAssignmentsService: CourseAssignmentsService,
  ) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Assign a course to an instructor' })
  @ApiResponse({ status: 201, description: 'Course assigned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  create(@Body() createCourseAssignmentDto: CreateCourseAssignmentDto) {
    return this.courseAssignmentsService.create(createCourseAssignmentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all course assignments or filter by course/instructor',
  })
  @ApiQuery({
    name: 'courseId',
    required: false,
    description: 'Filter by course UUID',
  })
  @ApiQuery({
    name: 'instructorId',
    required: false,
    description: 'Filter by instructor UUID',
  })
  @ApiResponse({ status: 200, description: 'List of course assignments' })
  findAll(
    @Query('courseId') courseId?: string,
    @Query('instructorId') instructorId?: string,
  ) {
    if (courseId) {
      return this.courseAssignmentsService.findByCourse(courseId);
    }
    if (instructorId) {
      return this.courseAssignmentsService.findByInstructor(instructorId);
    }
    return this.courseAssignmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course assignment by ID' })
  @ApiResponse({ status: 200, description: 'Course assignment found' })
  @ApiResponse({ status: 404, description: 'Course assignment not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.courseAssignmentsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Update course assignment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Course assignment updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Course assignment not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCourseAssignmentDto: UpdateCourseAssignmentDto,
  ) {
    return this.courseAssignmentsService.update(id, updateCourseAssignmentDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Delete course assignment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Course assignment deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Course assignment not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.courseAssignmentsService.remove(id);
  }
}
