import { IsString, IsNotEmpty, IsOptional, IsInt, IsEnum, IsDateString } from 'class-validator';
import { LeadActivityType } from '@housing/database';

export class CreateActivityDto {
  @IsEnum(LeadActivityType)
  type: LeadActivityType;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  duration?: number;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @IsOptional()
  metadata?: any;
}
