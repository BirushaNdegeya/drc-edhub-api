import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSchoolDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'St Mary School',
    description: 'Name of the school',
  })
  name!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'st-mary-school',
    description: 'URL-friendly school identifier',
  })
  slug!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'A leading school in the region',
    description: 'Description of the school',
  })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'https://example.com/logo.png',
    description: 'URL to the school logo',
  })
  logoUrl?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    example: true,
    description: 'Whether the school is active',
  })
  isActive?: boolean;
}
