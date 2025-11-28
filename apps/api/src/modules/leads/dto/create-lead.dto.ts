import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { LeadSource } from '@housing/database';

export class CreateLeadDto {
  @ApiProperty({ example: 'clxxx' })
  @IsString()
  listingId: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'john@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '+91 9876543210' })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ example: 'I am interested in this property...' })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({ enum: LeadSource, example: LeadSource.PHONE_REVEAL })
  @IsEnum(LeadSource)
  source: LeadSource;
}
