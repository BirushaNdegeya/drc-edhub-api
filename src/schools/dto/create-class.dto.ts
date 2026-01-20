import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  class!: string;

  @IsUUID()
  @IsNotEmpty()
  schoolId!: string;
}
