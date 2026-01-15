import { IsNotEmpty, IsOptional, IsString, IsInt, IsUUID, IsBoolean } from 'class-validator';

export class CreateModuleDto {
  @IsNotEmpty()
  @IsUUID()
  courseId!: string;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsOptional()
  @IsInt()
  orderIndex?: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
