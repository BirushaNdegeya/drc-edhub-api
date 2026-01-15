import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLessonProgressDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'UUID of the user',
  })
  userId!: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'UUID of the lesson',
  })
  lessonId!: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    example: false,
    description: 'Whether the lesson is completed',
  })
  completed?: boolean;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    example: 0,
    description: 'Number of seconds watched',
  })
  watchedSeconds?: number;
}
