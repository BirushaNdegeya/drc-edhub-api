import { IsNotEmpty, IsOptional, IsUUID, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEnrollmentDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'UUID of the user enrolling in the course',
  })
  userId!: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'UUID of the course to enroll in',
  })
  courseId!: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    example: 0,
    description: 'Initial progress percentage (0-100)',
  })
  progressPercentage?: number;
}
