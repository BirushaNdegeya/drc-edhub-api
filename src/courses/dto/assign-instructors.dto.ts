import { IsArray, IsUUID, IsNotEmpty } from 'class-validator';

export class AssignInstructorsDto {
  @IsArray()
  @IsUUID('all', { each: true })
  @IsNotEmpty()
  instructorIds!: string[];
}
