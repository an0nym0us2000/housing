import { IsString, IsOptional, IsEnum, IsDateString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Follow up with client about property viewing',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiPropertyOptional({
    description: 'Task description',
    example: 'Call Mr. Smith to confirm viewing appointment for villa in downtown',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'User ID to assign task to',
    example: 'clx1234567890',
  })
  @IsString()
  assignedToId: string;

  @ApiPropertyOptional({
    description: 'Task priority',
    enum: TaskPriority,
    example: 'HIGH',
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiPropertyOptional({
    description: 'Due date for the task',
    example: '2024-12-31T10:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiPropertyOptional({
    description: 'Related lead ID',
    example: 'clx9876543210',
  })
  @IsString()
  @IsOptional()
  leadId?: string;

  @ApiPropertyOptional({
    description: 'Related listing ID',
    example: 'clx5555555555',
  })
  @IsString()
  @IsOptional()
  listingId?: string;
}
