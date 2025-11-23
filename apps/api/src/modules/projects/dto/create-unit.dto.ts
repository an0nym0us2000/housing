import { IsString, IsEnum, IsOptional, IsNumber, IsArray, Min, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UnitType {
  STUDIO = 'STUDIO',
  ONE_BHK = 'ONE_BHK',
  TWO_BHK = 'TWO_BHK',
  THREE_BHK = 'THREE_BHK',
  FOUR_BHK = 'FOUR_BHK',
  PENTHOUSE = 'PENTHOUSE',
  VILLA = 'VILLA',
  PLOT = 'PLOT',
  SHOP = 'SHOP',
  OFFICE = 'OFFICE',
}

export enum UnitStatus {
  AVAILABLE = 'AVAILABLE',
  BLOCKED = 'BLOCKED',
  SOLD = 'SOLD',
  BOOKED = 'BOOKED',
  HOLD = 'HOLD',
}

export class CreateUnitDto {
  @ApiPropertyOptional({
    description: 'Tower ID (optional for standalone units)',
    example: 'clx1234567890',
  })
  @IsString()
  @IsOptional()
  towerId?: string;

  @ApiProperty({
    description: 'Unit number',
    example: 'A-101',
  })
  @IsString()
  @MinLength(1)
  unitNumber: string;

  @ApiPropertyOptional({
    description: 'Floor number',
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  floor?: number;

  @ApiProperty({
    description: 'Unit type',
    enum: UnitType,
    example: 'TWO_BHK',
  })
  @IsEnum(UnitType)
  unitType: UnitType;

  @ApiPropertyOptional({
    description: 'Carpet area in sqft',
    example: 850,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  carpetArea?: number;

  @ApiPropertyOptional({
    description: 'Built-up area in sqft',
    example: 1100,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  builtupArea?: number;

  @ApiPropertyOptional({
    description: 'Super area in sqft',
    example: 1250,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  superArea?: number;

  @ApiProperty({
    description: 'Base price',
    example: 7500000,
  })
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiPropertyOptional({
    description: 'Final price after discounts',
    example: 7200000,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  finalPrice?: number;

  @ApiPropertyOptional({
    description: 'Number of bedrooms',
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  bedrooms?: number;

  @ApiPropertyOptional({
    description: 'Number of bathrooms',
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  bathrooms?: number;

  @ApiPropertyOptional({
    description: 'Number of balconies',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  balconies?: number;

  @ApiPropertyOptional({
    description: 'Facing direction',
    example: 'North',
  })
  @IsString()
  @IsOptional()
  facing?: string;

  @ApiPropertyOptional({
    description: 'Furnishing status',
    example: 'Semi-furnished',
  })
  @IsString()
  @IsOptional()
  furnishing?: string;

  @ApiPropertyOptional({
    description: 'Unit features',
    example: ['Modular Kitchen', 'False Ceiling', 'Vitrified Tiles'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @ApiPropertyOptional({
    description: 'Unit status',
    enum: UnitStatus,
    example: 'AVAILABLE',
  })
  @IsEnum(UnitStatus)
  @IsOptional()
  status?: UnitStatus;
}
