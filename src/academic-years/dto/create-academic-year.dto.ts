import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAcademicYearDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  province?: string;
}
