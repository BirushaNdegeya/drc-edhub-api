import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LessonProgress } from './lesson-progress.model';
import { CreateLessonProgressDto } from './dto/create-lesson-progress.dto';
import { UpdateLessonProgressDto } from './dto/update-lesson-progress.dto';

@Injectable()
export class LessonProgressService {
  constructor(
    @InjectModel(LessonProgress)
    private lessonProgressModel: typeof LessonProgress,
  ) {}

  async create(createLessonProgressDto: CreateLessonProgressDto): Promise<LessonProgress> {
    // Check if progress already exists
    const existing = await this.lessonProgressModel.findOne({
      where: {
        userId: createLessonProgressDto.userId,
        lessonId: createLessonProgressDto.lessonId,
      },
    });

    if (existing) {
      throw new ConflictException('Progress record already exists for this user and lesson');
    }

    const progress = await this.lessonProgressModel.create(createLessonProgressDto as any);
    
    // Set completedAt if completed is true
    if (progress.completed && !progress.completedAt) {
      progress.completedAt = new Date();
      await progress.save();
    }

    return progress;
  }

  async findAll(): Promise<LessonProgress[]> {
    return this.lessonProgressModel.findAll({
      include: ['user', 'lesson'],
    });
  }

  async findOne(id: string): Promise<LessonProgress> {
    const progress = await this.lessonProgressModel.findByPk(id, {
      include: ['user', 'lesson'],
    });
    if (!progress) {
      throw new NotFoundException(`LessonProgress with ID ${id} not found`);
    }
    return progress;
  }

  async update(id: string, updateLessonProgressDto: UpdateLessonProgressDto): Promise<LessonProgress> {
    const progress = await this.findOne(id);
    
    // Set completedAt if completed is being set to true
    if (updateLessonProgressDto.completed === true && !progress.completedAt) {
      await progress.update({
        ...updateLessonProgressDto,
        completedAt: new Date(),
      });
    } else {
      await progress.update(updateLessonProgressDto);
    }
    
    return progress.reload();
  }

  async remove(id: string): Promise<void> {
    const progress = await this.findOne(id);
    await progress.destroy();
  }

  async findByUser(userId: string): Promise<LessonProgress[]> {
    return this.lessonProgressModel.findAll({
      where: { userId },
      include: ['lesson'],
    });
  }

  async findByLesson(lessonId: string): Promise<LessonProgress[]> {
    return this.lessonProgressModel.findAll({
      where: { lessonId },
      include: ['user'],
    });
  }

  async findByUserAndLesson(userId: string, lessonId: string): Promise<LessonProgress | null> {
    return this.lessonProgressModel.findOne({
      where: { userId, lessonId },
      include: ['user', 'lesson'],
    });
  }
}
