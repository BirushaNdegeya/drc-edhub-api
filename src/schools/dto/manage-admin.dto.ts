import { IsUUID, IsNotEmpty } from 'class-validator';

export class ManageSchoolAdminDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;
}
