import { IsNotEmpty, IsOptional, IsString, IsInt, IsUUID, IsBoolean, IsEnum } from 'class-validator';
import type { ContentType } from '../lesson.model';

export class CreateLessonDto {
  @IsNotEmpty()
  @IsUUID()
  moduleId!: string;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsEnum(['video', 'text', 'quiz', 'assignment'])
  contentType!: ContentType;

  @IsOptional()
  @IsInt()
  durationMinutes?: number;

  @IsOptional()
  @IsString()
  contentUrl?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsInt()
  orderIndex?: number;

  @IsOptional()
  @IsUUID()
  createdById?: string;
}
