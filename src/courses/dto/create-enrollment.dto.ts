import { IsNotEmpty, IsOptional, IsUUID, IsNumber } from 'class-validator';

export class CreateEnrollmentDto {
  @IsNotEmpty()
  @IsUUID()
  userId!: string;

  @IsNotEmpty()
  @IsUUID()
  courseId!: string;

  @IsOptional()
  @IsNumber()
  progressPercentage?: number;
}
