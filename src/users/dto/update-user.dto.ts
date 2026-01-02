import { IsOptional, IsString, IsEnum, IsInt, IsEmail } from 'class-validator';
import type { UserRole } from '../user.model';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'John' })
  firstname?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Doe' })
  lastname?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Middle' })
  surname?: string;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ example: 20 })
  age?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'St Mary School' })
  school?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Province X' })
  province?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'City Y' })
  location?: string;

  @IsOptional()
  @IsEnum(['student', 'instructor', 'admin', 'inspector', 'school-admin'])
  @ApiPropertyOptional({ example: 'student', enum: ['student', 'instructor', 'admin', 'inspector', 'school-admin'] })
  role?: UserRole;

  @IsOptional()
  @IsEnum(['male', 'female'])
  @ApiPropertyOptional({ example: 'male', enum: ['male', 'female'] })
  sex?: 'male' | 'female';

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'A' })
  section?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Grade 1' })
  class?: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({ example: 'user@example.com' })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'https://lh3.googleusercontent.com/a-/AOh14Gj...photo.jpg' })
  avatar?: string;
}
