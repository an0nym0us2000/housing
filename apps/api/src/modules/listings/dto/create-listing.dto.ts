import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsDateString,
  Min,
  IsArray,
} from 'class-validator';
import {
  ListingType,
  PropertyType,
  FurnishingStatus,
  AvailabilityStatus,
} from '@housing/database';

export class CreateListingDto {
  @ApiProperty({ example: 'Luxurious 3 BHK Apartment in Koramangala' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Spacious apartment with modern amenities...' })
  @IsString()
  description: string;

  @ApiProperty({ enum: ListingType, example: ListingType.SALE })
  @IsEnum(ListingType)
  listingType: ListingType;

  @ApiProperty({ enum: PropertyType, example: PropertyType.APARTMENT })
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @ApiProperty({ example: 'clxxx' })
  @IsString()
  cityId: string;

  @ApiProperty({ example: 'clxxx' })
  @IsString()
  localityId: string;

  @ApiProperty({ example: '123 Main Street, Koramangala' })
  @IsString()
  address: string;

  @ApiPropertyOptional({ example: '560095' })
  @IsString()
  @IsOptional()
  pincode?: string;

  @ApiPropertyOptional({ example: 12.9352 })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({ example: 77.6245 })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsNumber()
  @IsOptional()
  bhk?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsNumber()
  @IsOptional()
  bathrooms?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  balconies?: number;

  @ApiPropertyOptional({ example: 1200 })
  @IsNumber()
  @IsOptional()
  carpetArea?: number;

  @ApiPropertyOptional({ example: 1450 })
  @IsNumber()
  @IsOptional()
  builtUpArea?: number;

  @ApiPropertyOptional({ example: 1500 })
  @IsNumber()
  @IsOptional()
  plotArea?: number;

  @ApiPropertyOptional({ enum: FurnishingStatus })
  @IsEnum(FurnishingStatus)
  @IsOptional()
  furnishing?: FurnishingStatus;

  @ApiPropertyOptional({ example: 10 })
  @IsNumber()
  @IsOptional()
  totalFloors?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber()
  @IsOptional()
  floorNumber?: number;

  @ApiProperty({ example: 5000000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 3333 })
  @IsNumber()
  @IsOptional()
  pricePerSqft?: number;

  @ApiPropertyOptional({ example: 100000 })
  @IsNumber()
  @IsOptional()
  securityDeposit?: number;

  @ApiPropertyOptional({ example: 2000 })
  @IsNumber()
  @IsOptional()
  maintenanceFee?: number;

  @ApiPropertyOptional({ enum: AvailabilityStatus })
  @IsEnum(AvailabilityStatus)
  @IsOptional()
  availability?: AvailabilityStatus;

  @ApiPropertyOptional({ example: '2025-01-01' })
  @IsDateString()
  @IsOptional()
  possessionDate?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber()
  @IsOptional()
  propertyAge?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  parking?: boolean;

  @ApiPropertyOptional({ example: 2 })
  @IsNumber()
  @IsOptional()
  parkingCount?: number;

  @ApiPropertyOptional({ example: ['clxxx', 'clyyy'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenityIds?: string[];
}
