import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { VisitStatus } from '@housing/database';

export class UpdateVisitDto {
  @ApiProperty({ description: 'Visit status', required: false, enum: VisitStatus })
  @IsOptional()
  @IsEnum(VisitStatus)
  status?: VisitStatus;

  @ApiProperty({ description: 'Reschedule date and time', required: false })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiProperty({ description: 'Rescheduling reason', required: false })
  @IsOptional()
  @IsString()
  rescheduledReason?: string;

  @ApiProperty({ description: 'Owner notes', required: false })
  @IsOptional()
  @IsString()
  ownerNotes?: string;

  @ApiProperty({ description: 'Cancellation reason', required: false })
  @IsOptional()
  @IsString()
  cancellationReason?: string;

  @ApiProperty({ description: 'Feedback after visit', required: false })
  @IsOptional()
  @IsString()
  feedback?: string;

  @ApiProperty({ description: 'Rating (1-5)', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;
}
