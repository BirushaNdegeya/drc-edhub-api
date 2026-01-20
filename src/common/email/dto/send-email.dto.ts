import { IsString, IsEmail, IsOptional, IsArray } from 'class-validator';

export class SendEmailDto {
  @IsEmail({}, { each: true })
  to!: string | string[];

  @IsString()
  subject!: string;

  @IsString()
  html!: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsEmail({}, { each: true })
  @IsOptional()
  cc?: string[];

  @IsEmail({}, { each: true })
  @IsOptional()
  bcc?: string[];

  @IsEmail()
  @IsOptional()
  from?: string;
}
