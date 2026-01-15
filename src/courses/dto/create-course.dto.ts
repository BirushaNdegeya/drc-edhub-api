import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { CourseStatus } from '../course.model';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'UUID of the school',
  })
  schoolId!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Introduction to Mathematics',
    description: 'Course title',
  })
  title!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'intro-to-math',
    description: 'URL-friendly course identifier',
  })
  slug!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Learn the basics of mathematics',
    description: 'Detailed course description',
  })
  description?: string;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    example: 12,
    description: 'Duration of the course in weeks',
  })
  durationWeeks?: number;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    example: 24,
    description: 'Total number of lessons in the course',
  })
  totalLessons?: number;

  @IsOptional()
  @IsEnum(['draft', 'pending_review', 'published', 'archived'])
  @ApiPropertyOptional({
    example: 'draft',
    enum: ['draft', 'pending_review', 'published', 'archived'],
    description: 'Current status of the course',
  })
  status?: CourseStatus;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'UUID of the user who created the course',
  })
  createdById!: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'UUID of the course instructor',
  })
  instructorId?: string;
}
