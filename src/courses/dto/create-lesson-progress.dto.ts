import { IsNotEmpty, IsOptional, IsUUID, IsBoolean, IsInt } from 'class-validator';

export class CreateLessonProgressDto {
  @IsNotEmpty()
  @IsUUID()
  userId!: string;

  @IsNotEmpty()
  @IsUUID()
  lessonId!: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsInt()
  watchedSeconds?: number;
}
