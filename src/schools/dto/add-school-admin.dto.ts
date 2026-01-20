import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class AddSchoolAdministratorDto {
  @IsUUID()
  @IsNotEmpty()
  schoolId!: string;

  @IsUUID()
  @IsNotEmpty()
  userId!: string;
}
