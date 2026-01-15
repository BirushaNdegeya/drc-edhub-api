import { IsOptional, IsString, IsEnum, IsInt, IsEmail } from 'class-validator';
import type { UserRole } from '../user.model';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'John',
    description: 'User first name',
  })
  firstname?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Doe',
    description: 'User last name',
  })
  lastname?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Middle',
    description: 'User middle name',
  })
  surname?: string;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    example: 20,
    description: 'User age',
  })
  age?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'St Mary School',
    description: 'School name',
  })
  school?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Province X',
    description: 'Province',
  })
  province?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'City Y',
    description: 'City/Location',
  })
  location?: string;

  @IsOptional()
  @IsEnum(['student', 'instructor', 'admin', 'inspector', 'school-admin'])
  @ApiPropertyOptional({
    example: 'student',
    enum: ['student', 'instructor', 'admin', 'inspector', 'school-admin'],
    description: 'User role',
  })
  role?: UserRole;

  @IsOptional()
  @IsEnum(['male', 'female'])
  @ApiPropertyOptional({
    example: 'male',
    enum: ['male', 'female'],
    description: 'User gender',
  })
  sex?: 'male' | 'female';

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'A',
    description: 'Section/Class section',
  })
  section?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Grade 1',
    description: 'Class/Grade level',
  })
  class?: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'User email address',
  })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'https://lh3.googleusercontent.com/a-/AOh14Gj...photo.jpg',
    description: 'User avatar URL',
  })
  avatar?: string;
}
