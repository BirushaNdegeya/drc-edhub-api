import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Unique user identifier',
  })
  id!: string;

  @ApiProperty({
    example: 'John',
    required: true,
    description: 'User first name',
  })
  firstname!: string;

  @ApiProperty({
    example: 'Doe',
    required: true,
    description: 'User last name',
  })
  lastname!: string;

  @ApiProperty({
    example: 'Middle',
    required: false,
    description: 'User middle name',
  })
  surname?: string;

  @ApiProperty({
    example: 20,
    required: false,
    description: 'User age',
  })
  age?: number;

  @ApiProperty({
    example: 'St Mary School',
    required: false,
    description: 'School name',
  })
  school?: string;

  @ApiProperty({
    example: 'Province X',
    required: false,
    description: 'Province',
  })
  province?: string;

  @ApiProperty({
    example: 'City Y',
    required: false,
    description: 'City/Location',
  })
  location?: string;

  @ApiProperty({
    example: 'student',
    description: 'User role',
  })
  role!: string;

  @ApiProperty({
    example: 'male',
    required: false,
    description: 'User gender',
  })
  sex?: string;

  @ApiProperty({
    example: 'A',
    required: false,
    description: 'Section/Class section',
  })
  section?: string;

  @ApiProperty({
    example: 'Grade 1',
    required: false,
    description: 'Class/Grade level',
  })
  class?: string;

  @ApiProperty({
    example: 'user@example.com',
    required: false,
    description: 'User email address',
  })
  email?: string;

  @ApiProperty({
    example: 'https://lh3.googleusercontent.com/a-/AOh14Gj...photo.jpg',
    required: false,
    description: 'User avatar URL',
  })
  avatar?: string;
}
