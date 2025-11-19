import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsEmail } from 'class-validator';

export class CreateVisitDto {
  @ApiProperty({ description: 'Listing ID to visit' })
  @IsString()
  listingId: string;

  @ApiProperty({ description: 'Scheduled date and time for visit' })
  @IsDateString()
  scheduledAt: string;

  @ApiProperty({ description: 'Visitor name' })
  @IsString()
  visitorName: string;

  @ApiProperty({ description: 'Visitor phone number' })
  @IsString()
  visitorPhone: string;

  @ApiProperty({ description: 'Visitor email', required: false })
  @IsOptional()
  @IsEmail()
  visitorEmail?: string;

  @ApiProperty({ description: 'Message or special requests', required: false })
  @IsOptional()
  @IsString()
  message?: string;
}
