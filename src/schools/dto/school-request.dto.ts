import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import type { SchoolRequestStatus } from '../school-request.model';

export class CreateSchoolRequestDto {
  @IsString()
  @IsNotEmpty()
  school!: string;

  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsEnum(['pending', 'in_progress', 'accepted', 'rejected'])
  status?: SchoolRequestStatus;
}
