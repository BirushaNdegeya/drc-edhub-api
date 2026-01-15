import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseAssignmentDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'UUID of the course to assign',
  })
  courseId!: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'UUID of the instructor to assign the course to',
  })
  instructorId!: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'UUID of the admin assigning the course',
  })
  assignedById!: string;
}
