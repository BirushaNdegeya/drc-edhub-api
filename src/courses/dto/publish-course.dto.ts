import { IsBoolean, IsNotEmpty } from 'class-validator';

export class PublishCourseDto {
  @IsBoolean()
  @IsNotEmpty()
  published!: boolean;
}
