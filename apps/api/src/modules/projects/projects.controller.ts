import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateTowerDto } from './dto/create-tower.dto';
import { CreateUnitDto } from './dto/create-unit.dto';
import { BulkCreateUnitsDto } from './dto/bulk-create-units.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new project (builder only)' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @ApiResponse({ status: 403, description: 'Only builders can create projects' })
  create(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(req.user.id, createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all published projects' })
  @ApiResponse({ status: 200, description: 'Returns all published projects' })
  findAll(@Query() query: any) {
    return this.projectsService.findAll(query);
  }

  @Get('my-projects')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get builder's own projects" })
  @ApiResponse({ status: 200, description: "Returns builder's projects" })
  getMyProjects(@Request() req) {
    return this.projectsService.getMyProjects(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiResponse({ status: 200, description: 'Returns project details' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get project by slug' })
  @ApiResponse({ status: 200, description: 'Returns project details' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update project' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  update(@Param('id') id: string, @Request() req, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, req.user.id, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete project' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  delete(@Param('id') id: string, @Request() req) {
    return this.projectsService.delete(id, req.user.id);
  }

  // Tower Management
  @Post(':id/towers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add tower to project' })
  @ApiResponse({ status: 201, description: 'Tower created successfully' })
  createTower(@Param('id') id: string, @Request() req, @Body() createTowerDto: CreateTowerDto) {
    return this.projectsService.createTower(id, req.user.id, createTowerDto);
  }

  @Get(':id/towers')
  @ApiOperation({ summary: 'Get all towers in project' })
  @ApiResponse({ status: 200, description: 'Returns project towers' })
  getTowers(@Param('id') id: string) {
    return this.projectsService.getTowers(id);
  }

  // Unit Management
  @Post(':id/units')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add unit to project' })
  @ApiResponse({ status: 201, description: 'Unit created successfully' })
  @ApiResponse({ status: 400, description: 'Unit number already exists' })
  createUnit(@Param('id') id: string, @Request() req, @Body() createUnitDto: CreateUnitDto) {
    return this.projectsService.createUnit(id, req.user.id, createUnitDto);
  }

  @Post(':id/units/bulk')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk upload units' })
  @ApiResponse({ status: 201, description: 'Units created successfully' })
  bulkCreateUnits(
    @Param('id') id: string,
    @Request() req,
    @Body() bulkCreateUnitsDto: BulkCreateUnitsDto
  ) {
    return this.projectsService.bulkCreateUnits(id, req.user.id, bulkCreateUnitsDto);
  }

  @Get(':id/units')
  @ApiOperation({ summary: 'Get all units in project' })
  @ApiResponse({ status: 200, description: 'Returns project units' })
  getUnits(@Param('id') id: string, @Query() query: any) {
    return this.projectsService.getUnits(id, query);
  }

  @Patch('units/:unitId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update unit' })
  @ApiResponse({ status: 200, description: 'Unit updated successfully' })
  updateUnit(@Param('unitId') unitId: string, @Request() req, @Body() updateData: any) {
    return this.projectsService.updateUnit(unitId, req.user.id, updateData);
  }

  // Analytics
  @Get(':id/inventory-summary')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get inventory summary' })
  @ApiResponse({ status: 200, description: 'Returns inventory summary' })
  getInventorySummary(@Param('id') id: string, @Request() req) {
    return this.projectsService.getInventorySummary(id, req.user.id);
  }

  @Get(':id/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get project statistics' })
  @ApiResponse({ status: 200, description: 'Returns project stats' })
  getProjectStats(@Param('id') id: string, @Request() req) {
    return this.projectsService.getProjectStats(id, req.user.id);
  }
}
