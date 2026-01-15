import { IsNotEmpty, IsOptional, IsString, IsInt, IsUUID, IsEnum } from 'class-validator';
import type { CourseStatus } from '../course.model';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsUUID()
  schoolId!: string;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  slug!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  durationWeeks?: number;

  @IsOptional()
  @IsInt()
  totalLessons?: number;

  @IsOptional()
  @IsEnum(['draft', 'pending_review', 'published', 'archived'])
  status?: CourseStatus;

  @IsNotEmpty()
  @IsUUID()
  createdById!: string;

  @IsOptional()
  @IsUUID()
  instructorId?: string;
}
