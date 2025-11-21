import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({
    description: 'Team name',
    example: 'Elite Realty Team',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiPropertyOptional({
    description: 'Team description',
    example: 'Specialized in luxury properties in downtown area',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
