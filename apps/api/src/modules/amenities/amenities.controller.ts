import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AmenitiesService } from './amenities.service';

@ApiTags('amenities')
@Controller('amenities')
export class AmenitiesController {
  constructor(private readonly amenitiesService: AmenitiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active amenities' })
  @ApiResponse({ status: 200, description: 'Returns list of amenities' })
  @ApiQuery({ name: 'category', required: false, example: 'lifestyle' })
  findAll(@Query('category') category?: string) {
    if (category) {
      return this.amenitiesService.findByCategory(category);
    }
    return this.amenitiesService.findAll();
  }
}
