import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsUUID,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { ContentType } from '../lesson.model';

export class CreateLessonDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'UUID of the module',
  })
  moduleId!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Lesson 1: Getting Started',
    description: 'Title of the lesson',
  })
  title!: string;

  @IsNotEmpty()
  @IsEnum(['video', 'text', 'quiz', 'assignment'])
  @ApiProperty({
    example: 'video',
    enum: ['video', 'text', 'quiz', 'assignment'],
    description: 'Type of content for this lesson',
  })
  contentType!: ContentType;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    example: 45,
    description: 'Duration of the lesson in minutes',
  })
  durationMinutes?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'https://example.com/lesson-content',
    description: 'URL to the lesson content',
  })
  contentUrl?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    example: true,
    description: 'Whether the lesson is published',
  })
  isPublished?: boolean;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    example: 1,
    description: 'Order index of the lesson within the module',
  })
  orderIndex?: number;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'UUID of the user who created the lesson',
  })
  createdById?: string;
}
