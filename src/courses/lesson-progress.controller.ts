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
import { LessonProgressService } from './lesson-progress.service';
import { CreateLessonProgressDto } from './dto/create-lesson-progress.dto';
import { UpdateLessonProgressDto } from './dto/update-lesson-progress.dto';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('lesson-progress')
export class LessonProgressController {
  constructor(private readonly lessonProgressService: LessonProgressService) {}

  @Post()
  create(@Body() createLessonProgressDto: CreateLessonProgressDto) {
    return this.lessonProgressService.create(createLessonProgressDto);
  }

  @Get()
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
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.lessonProgressService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLessonProgressDto: UpdateLessonProgressDto,
  ) {
    return this.lessonProgressService.update(id, updateLessonProgressDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.lessonProgressService.remove(id);
  }
}
