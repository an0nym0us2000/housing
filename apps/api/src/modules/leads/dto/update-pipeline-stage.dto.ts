import { IsEnum } from 'class-validator';
import { LeadPipelineStage } from '@housing/database';

export class UpdatePipelineStageDto {
  @IsEnum(LeadPipelineStage)
  pipelineStage: LeadPipelineStage;
}
