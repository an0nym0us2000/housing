import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { LocationsService } from './locations.service';

@ApiTags('locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('cities')
  @ApiOperation({ summary: 'Get all active cities' })
  @ApiResponse({ status: 200, description: 'Returns list of cities' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query' })
  getCities(@Query('q') query?: string) {
    if (query) {
      return this.locationsService.searchCities(query);
    }
    return this.locationsService.getCities();
  }

  @Get('cities/:id')
  @ApiOperation({ summary: 'Get city with localities' })
  @ApiResponse({ status: 200, description: 'Returns city details with localities' })
  @ApiParam({ name: 'id', description: 'City ID' })
  getCity(@Param('id') id: string) {
    return this.locationsService.getCity(id);
  }

  @Get('cities/:cityId/localities')
  @ApiOperation({ summary: 'Get localities for a city' })
  @ApiResponse({ status: 200, description: 'Returns list of localities' })
  @ApiParam({ name: 'cityId', description: 'City ID' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query' })
  getLocalities(@Param('cityId') cityId: string, @Query('q') query?: string) {
    if (query) {
      return this.locationsService.searchLocalities(cityId, query);
    }
    return this.locationsService.getLocalities(cityId);
  }
}
