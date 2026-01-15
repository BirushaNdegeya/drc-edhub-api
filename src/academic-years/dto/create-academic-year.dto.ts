import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAcademicYearDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '2024-2025',
    description: 'The name of the academic year',
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'https://example.com/academic-year',
    description: 'Link associated with the academic year',
  })
  link?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Western Province',
    description: 'Province where the academic year is applicable',
  })
  province?: string;
}
