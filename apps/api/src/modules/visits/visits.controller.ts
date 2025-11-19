import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/swagger';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VisitsService } from './visits.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { QueryVisitDto } from './dto/query-visit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('visits')
@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Schedule a property visit' })
  @ApiResponse({ status: 201, description: 'Visit scheduled successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  create(@Request() req, @Body() createVisitDto: CreateVisitDto) {
    return this.visitsService.create(req.user.id, createVisitDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all visits (admin only)' })
  @ApiResponse({ status: 200, description: 'Returns paginated visits' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Query() query: QueryVisitDto) {
    return this.visitsService.findAll(query);
  }

  @Get('my-visits-as-visitor')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my scheduled visits' })
  @ApiResponse({ status: 200, description: 'Returns user\'s scheduled visits' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMyVisitsAsVisitor(@Request() req, @Query() query: QueryVisitDto) {
    return this.visitsService.getMyVisitsAsVisitor(req.user.id, query);
  }

  @Get('my-visits-as-owner')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get visit requests for my properties' })
  @ApiResponse({ status: 200, description: 'Returns visit requests for owner\'s properties' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMyVisitsAsOwner(@Request() req, @Query() query: QueryVisitDto) {
    return this.visitsService.getMyVisitsAsOwner(req.user.id, query);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get visit statistics' })
  @ApiResponse({ status: 200, description: 'Returns visit statistics' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getVisitStats(@Request() req) {
    return this.visitsService.getVisitStats(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a visit by ID' })
  @ApiResponse({ status: 200, description: 'Returns visit details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Visit not found' })
  findOne(@Param('id') id: string) {
    return this.visitsService.findOne(id);
  }

  @Post(':id/confirm')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm a visit request (owner only)' })
  @ApiResponse({ status: 200, description: 'Visit confirmed' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Visit not found' })
  confirmVisit(@Param('id') id: string, @Request() req, @Body() updateVisitDto: UpdateVisitDto) {
    return this.visitsService.confirmVisit(id, req.user.id, updateVisitDto);
  }

  @Post(':id/reschedule')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reschedule a visit' })
  @ApiResponse({ status: 200, description: 'Visit rescheduled' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Visit not found' })
  rescheduleVisit(@Param('id') id: string, @Request() req, @Body() updateVisitDto: UpdateVisitDto) {
    return this.visitsService.rescheduleVisit(id, req.user.id, updateVisitDto);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a visit' })
  @ApiResponse({ status: 200, description: 'Visit cancelled' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Visit not found' })
  cancelVisit(@Param('id') id: string, @Request() req, @Body() updateVisitDto: UpdateVisitDto) {
    return this.visitsService.cancelVisit(id, req.user.id, updateVisitDto);
  }

  @Post(':id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark visit as completed (visitor only)' })
  @ApiResponse({ status: 200, description: 'Visit marked as completed' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Visit not found' })
  completeVisit(@Param('id') id: string, @Request() req, @Body() updateVisitDto: UpdateVisitDto) {
    return this.visitsService.completeVisit(id, req.user.id, updateVisitDto);
  }
}
