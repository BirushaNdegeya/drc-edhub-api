import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsUUID()
  @IsNotEmpty()
  schoolId!: string;
}
