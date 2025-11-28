import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TeamRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
}

export class AddTeamMemberDto {
  @ApiProperty({
    description: 'User ID to add as team member',
    example: 'clx1234567890',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Role for the team member',
    enum: TeamRole,
    example: 'AGENT',
  })
  @IsEnum(TeamRole)
  role: TeamRole;
}
