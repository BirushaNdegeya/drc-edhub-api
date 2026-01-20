import { IsString, IsNotEmpty, IsUUID, IsArray, IsOptional, IsNumber } from 'class-validator';

export class CreateSchoolCourseDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  durationWeeks?: number;

  @IsArray()
  @IsOptional()
  @IsUUID('all', { each: true })
  instructorIds?: string[];

  @IsUUID()
  @IsOptional()
  levelId?: string;
}
