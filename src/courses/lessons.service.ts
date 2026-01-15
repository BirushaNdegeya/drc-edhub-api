import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Lesson } from './lesson.model';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    @InjectModel(Lesson)
    private lessonModel: typeof Lesson,
  ) {}

  async create(createLessonDto: CreateLessonDto): Promise<Lesson> {
    return this.lessonModel.create(createLessonDto as any);
  }

  async findAll(): Promise<Lesson[]> {
    return this.lessonModel.findAll({
      include: ['module', 'createdBy'],
    });
  }

  async findOne(id: string): Promise<Lesson> {
    const lesson = await this.lessonModel.findByPk(id, {
      include: ['module', 'createdBy'],
    });
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    return lesson;
  }

  async update(id: string, updateLessonDto: UpdateLessonDto): Promise<Lesson> {
    const lesson = await this.findOne(id);
    await lesson.update(updateLessonDto);
    return lesson;
  }

  async remove(id: string): Promise<void> {
    const lesson = await this.findOne(id);
    await lesson.destroy();
  }

  async findByModule(moduleId: string): Promise<Lesson[]> {
    return this.lessonModel.findAll({
      where: { moduleId },
      include: ['createdBy'],
      order: [['orderIndex', 'ASC']],
    });
  }
}
