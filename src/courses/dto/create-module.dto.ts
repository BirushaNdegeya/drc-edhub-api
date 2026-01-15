import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsUUID,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateModuleDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'UUID of the course',
  })
  courseId!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Module 1: Introduction',
    description: 'Title of the module',
  })
  title!: string;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    example: 1,
    description: 'Order index of the module within the course',
  })
  orderIndex?: number;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    example: true,
    description: 'Whether the module is published',
  })
  isPublished?: boolean;
}
