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
import { LessonProgressService } from './lesson-progress.service';
import { CreateLessonProgressDto } from './dto/create-lesson-progress.dto';
import { UpdateLessonProgressDto } from './dto/update-lesson-progress.dto';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiTags('Lesson Progress')
@Controller('lesson-progress')
export class LessonProgressController {
  constructor(private readonly lessonProgressService: LessonProgressService) {}

  @Post()
  @ApiOperation({ summary: 'Create lesson progress record' })
  @ApiResponse({
    status: 201,
    description: 'Lesson progress created successfully',
  })
  create(@Body() createLessonProgressDto: CreateLessonProgressDto) {
    return this.lessonProgressService.create(createLessonProgressDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get lesson progress records or filter by user/lesson',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter by user UUID',
  })
  @ApiQuery({
    name: 'lessonId',
    required: false,
    description: 'Filter by lesson UUID',
  })
  @ApiResponse({ status: 200, description: 'List of lesson progress records' })
  findAll(
    @Query('userId') userId?: string,
    @Query('lessonId') lessonId?: string,
  ) {
    if (userId && lessonId) {
      return this.lessonProgressService.findByUserAndLesson(userId, lessonId);
    }
    if (userId) {
      return this.lessonProgressService.findByUser(userId);
    }
    if (lessonId) {
      return this.lessonProgressService.findByLesson(lessonId);
    }
    return this.lessonProgressService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lesson progress by ID' })
  @ApiResponse({ status: 200, description: 'Lesson progress found' })
  @ApiResponse({ status: 404, description: 'Lesson progress not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.lessonProgressService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update lesson progress by ID' })
  @ApiResponse({
    status: 200,
    description: 'Lesson progress updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Lesson progress not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLessonProgressDto: UpdateLessonProgressDto,
  ) {
    return this.lessonProgressService.update(id, updateLessonProgressDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Delete lesson progress by ID' })
  @ApiResponse({
    status: 200,
    description: 'Lesson progress deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Lesson progress not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.lessonProgressService.remove(id);
  }
}
