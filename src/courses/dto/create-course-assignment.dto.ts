import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCourseAssignmentDto {
  @IsNotEmpty()
  @IsUUID()
  courseId!: string;

  @IsNotEmpty()
  @IsUUID()
  instructorId!: string;

  @IsNotEmpty()
  @IsUUID()
  assignedById!: string;
}
