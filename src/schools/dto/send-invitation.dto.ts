import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class SendInvitationDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsUUID()
  @IsNotEmpty()
  schoolId!: string;
}
