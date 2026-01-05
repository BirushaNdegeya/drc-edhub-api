import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id!: string;

  @ApiProperty({ example: 'John', required: true })
  firstname!: string;

  @ApiProperty({ example: 'Doe', required: true })
  lastname!: string;

  @ApiProperty({ example: 'Middle', required: false })
  surname?: string;

  @ApiProperty({ example: 20, required: false })
  age?: number;

  @ApiProperty({ example: 'St Mary School', required: false })
  school?: string;

  @ApiProperty({ example: 'Province X', required: false })
  province?: string;

  @ApiProperty({ example: 'City Y', required: false })
  location?: string;

  @ApiProperty({ example: 'student' })
  role!: string;

  @ApiProperty({ example: 'male', required: false })
  sex?: string;

  @ApiProperty({ example: 'A', required: false })
  section?: string;

  @ApiProperty({ example: 'Grade 1', required: false })
  class?: string;

  @ApiProperty({ example: 'user@example.com', required: false })
  email?: string;

  @ApiProperty({ example: 'https://lh3.googleusercontent.com/a-/AOh14Gj...photo.jpg', required: false })
  avatar?: string;
}
