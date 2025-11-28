import { IsString, IsNumber, Min, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTowerDto {
  @ApiProperty({
    description: 'Tower name',
    example: 'Tower A',
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    description: 'Total floors',
    example: 20,
  })
  @IsNumber()
  @Min(1)
  totalFloors: number;

  @ApiPropertyOptional({
    description: 'Units per floor',
    example: 4,
  })
  @IsNumber()
  @Min(1)
  unitsPerFloor?: number;
}
