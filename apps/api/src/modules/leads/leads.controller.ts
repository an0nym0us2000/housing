import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';
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
}
