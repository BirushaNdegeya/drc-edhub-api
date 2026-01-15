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
import { CourseAssignmentsService } from './course-assignments.service';
import { CreateCourseAssignmentDto } from './dto/create-course-assignment.dto';
import { UpdateCourseAssignmentDto } from './dto/update-course-assignment.dto';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('course-assignments')
export class CourseAssignmentsController {
  constructor(private readonly courseAssignmentsService: CourseAssignmentsService) {}

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() createCourseAssignmentDto: CreateCourseAssignmentDto) {
    return this.courseAssignmentsService.create(createCourseAssignmentDto);
  }

  @Get()
  findAll(@Query('courseId') courseId?: string, @Query('instructorId') instructorId?: string) {
    if (courseId) {
      return this.courseAssignmentsService.findByCourse(courseId);
    }
    if (instructorId) {
      return this.courseAssignmentsService.findByInstructor(instructorId);
    }
    return this.courseAssignmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.courseAssignmentsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCourseAssignmentDto: UpdateCourseAssignmentDto,
  ) {
    return this.courseAssignmentsService.update(id, updateCourseAssignmentDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.courseAssignmentsService.remove(id);
  }
}
