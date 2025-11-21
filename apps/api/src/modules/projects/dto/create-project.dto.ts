import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsArray,
  IsDateString,
  MinLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ProjectType {
  APARTMENT = 'APARTMENT',
  VILLA = 'VILLA',
  PLOT = 'PLOT',
  COMMERCIAL = 'COMMERCIAL',
  MIXED_USE = 'MIXED_USE',
}

export enum ProjectStatus {
  UPCOMING = 'UPCOMING',
  UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION',
  READY_TO_MOVE = 'READY_TO_MOVE',
  COMPLETED = 'COMPLETED',
}

export class CreateProjectDto {
  @ApiProperty({
    description: 'Project name',
    example: 'Prestige Lakeside Habitat',
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'Project description',
    example: 'Luxury apartment complex with world-class amenities',
  })
  @IsString()
  @MinLength(20)
  description: string;

  @ApiProperty({
    description: 'City ID',
    example: 'clx1234567890',
  })
  @IsString()
  cityId: string;

  @ApiPropertyOptional({
    description: 'Locality ID',
    example: 'clx0987654321',
  })
  @IsString()
  @IsOptional()
  localityId?: string;

  @ApiProperty({
    description: 'Project address',
    example: 'Varthur Road, Whitefield, Bangalore',
  })
  @IsString()
  address: string;

  @ApiPropertyOptional({
    description: 'Pincode',
    example: '560066',
  })
  @IsString()
  @IsOptional()
  pincode?: string;

  @ApiPropertyOptional({
    description: 'Latitude',
    example: 12.9716,
  })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Longitude',
    example: 77.5946,
  })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    description: 'Project type',
    enum: ProjectType,
    example: 'APARTMENT',
  })
  @IsEnum(ProjectType)
  projectType: ProjectType;

  @ApiProperty({
    description: 'Project status',
    enum: ProjectStatus,
    example: 'UNDER_CONSTRUCTION',
  })
  @IsEnum(ProjectStatus)
  projectStatus: ProjectStatus;

  @ApiPropertyOptional({
    description: 'RERA registration number',
    example: 'PRM/KA/RERA/1251/446/PR/171120/002426',
  })
  @IsString()
  @IsOptional()
  reraNumber?: string;

  @ApiPropertyOptional({
    description: 'Total area in acres/sqft',
    example: 25.5,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  totalArea?: number;

  @ApiPropertyOptional({
    description: 'Total towers/blocks',
    example: 12,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  totalTowers?: number;

  @ApiPropertyOptional({
    description: 'Total units',
    example: 1200,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  totalUnits?: number;

  @ApiPropertyOptional({
    description: 'Project launch date',
    example: '2023-01-15',
  })
  @IsDateString()
  @IsOptional()
  launchDate?: string;

  @ApiPropertyOptional({
    description: 'Expected possession date',
    example: '2026-12-31',
  })
  @IsDateString()
  @IsOptional()
  possessionDate?: string;

  @ApiPropertyOptional({
    description: 'Minimum price',
    example: 5000000,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  priceMin?: number;

  @ApiPropertyOptional({
    description: 'Maximum price',
    example: 15000000,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  priceMax?: number;

  @ApiPropertyOptional({
    description: 'Project amenities',
    example: ['Swimming Pool', 'Gym', 'Clubhouse', 'Children Play Area'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @ApiPropertyOptional({
    description: 'Project features',
    example: ['24x7 Security', 'Power Backup', 'Lift', 'Parking'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @ApiPropertyOptional({
    description: 'Project images',
    example: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({
    description: 'Brochure URL',
    example: 'https://example.com/brochure.pdf',
  })
  @IsString()
  @IsOptional()
  brochureUrl?: string;

  @ApiPropertyOptional({
    description: 'Video URL',
    example: 'https://youtube.com/watch?v=xxxxx',
  })
  @IsString()
  @IsOptional()
  videoUrl?: string;
}
