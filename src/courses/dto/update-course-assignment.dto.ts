import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseAssignmentDto } from './create-course-assignment.dto';

export class UpdateCourseAssignmentDto extends PartialType(CreateCourseAssignmentDto) {}
