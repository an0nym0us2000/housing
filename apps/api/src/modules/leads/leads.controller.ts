import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';
import { CreateActivityDto } from './dto/create-activity.dto';
import { AssignLeadDto } from './dto/assign-lead.dto';
import { UpdatePipelineStageDto } from './dto/update-pipeline-stage.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a lead (contact property owner)' })
  @ApiResponse({ status: 201, description: 'Lead created successfully' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  create(@Body() createLeadDto: CreateLeadDto, @Request() req) {
    // If user is authenticated, pass userId, otherwise anonymous lead
    const userId = req.user?.id;
    return this.leadsService.create(createLeadDto, userId);
  }

  @Get('my-leads')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get leads for owner (all their listings)' })
  @ApiResponse({ status: 200, description: 'Returns owner leads' })
  getOwnerLeads(@Request() req) {
    return this.leadsService.getOwnerLeads(req.user.id);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get lead statistics for owner' })
  @ApiResponse({ status: 200, description: 'Returns lead stats' })
  getStats(@Request() req) {
    return this.leadsService.getLeadStats(req.user.id);
  }

  @Get('listing/:listingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get leads for a specific listing' })
  @ApiResponse({ status: 200, description: 'Returns listing leads' })
  @ApiParam({ name: 'listingId', description: 'Listing ID' })
  getLeadsByListing(@Param('listingId') listingId: string, @Request() req) {
    return this.leadsService.getLeadsByListing(listingId, req.user.id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update lead status' })
  @ApiResponse({ status: 200, description: 'Lead status updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  updateStatus(@Param('id') id: string, @Request() req, @Body() updateDto: UpdateLeadStatusDto) {
    return this.leadsService.updateStatus(id, req.user.id, updateDto);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark lead as read' })
  @ApiResponse({ status: 200, description: 'Lead marked as read' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  markAsRead(@Param('id') id: string, @Request() req) {
    return this.leadsService.markAsRead(id, req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get lead details with activities' })
  @ApiResponse({ status: 200, description: 'Returns lead details' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  @ApiParam({ name: 'id', description: 'Lead ID' })
  getLeadDetails(@Param('id') id: string, @Request() req) {
    return this.leadsService.getLeadDetails(id, req.user.id);
  }

  @Post(':id/activities')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add activity to a lead' })
  @ApiResponse({ status: 201, description: 'Activity created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  @ApiParam({ name: 'id', description: 'Lead ID' })
  addActivity(@Param('id') id: string, @Request() req, @Body() createActivityDto: CreateActivityDto) {
    return this.leadsService.addActivity(id, req.user.id, createActivityDto);
  }

  @Get(':id/activities')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get activities for a lead' })
  @ApiResponse({ status: 200, description: 'Returns lead activities' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  @ApiParam({ name: 'id', description: 'Lead ID' })
  getActivities(@Param('id') id: string, @Request() req) {
    return this.leadsService.getActivities(id, req.user.id);
  }

  @Delete('activities/:activityId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an activity' })
  @ApiResponse({ status: 200, description: 'Activity deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Activity not found' })
  @ApiParam({ name: 'activityId', description: 'Activity ID' })
  deleteActivity(@Param('activityId') activityId: string, @Request() req) {
    return this.leadsService.deleteActivity(activityId, req.user.id);
  }

  @Post(':id/assign')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign lead to a user' })
  @ApiResponse({ status: 201, description: 'Lead assigned successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Lead or user not found' })
  @ApiParam({ name: 'id', description: 'Lead ID' })
  assignLead(@Param('id') id: string, @Request() req, @Body() assignLeadDto: AssignLeadDto) {
    return this.leadsService.assignLead(id, req.user.id, assignLeadDto.assignedToId);
  }

  @Get('assigned-to-me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get leads assigned to current user' })
  @ApiResponse({ status: 200, description: 'Returns assigned leads' })
  getAssignedLeads(@Request() req) {
    return this.leadsService.getAssignedLeads(req.user.id);
  }

  @Get('pipeline')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get leads grouped by pipeline stage (Kanban view)' })
  @ApiResponse({ status: 200, description: 'Returns leads grouped by stage' })
  getPipeline(@Request() req) {
    return this.leadsService.getLeadsPipeline(req.user.id);
  }

  @Patch(':id/pipeline')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update lead pipeline stage' })
  @ApiResponse({ status: 200, description: 'Pipeline stage updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  @ApiParam({ name: 'id', description: 'Lead ID' })
  updatePipelineStage(@Param('id') id: string, @Request() req, @Body() updateDto: UpdatePipelineStageDto) {
    return this.leadsService.updatePipelineStage(id, req.user.id, updateDto.pipelineStage);
  }
}
