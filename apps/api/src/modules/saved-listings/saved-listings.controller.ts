import { Controller, Get, Post, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { SavedListingsService } from './saved-listings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('saved-listings')
@Controller('saved-listings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SavedListingsController {
  constructor(private readonly savedListingsService: SavedListingsService) {}

  @Post(':listingId')
  @ApiOperation({ summary: 'Save a listing (add to wishlist)' })
  @ApiResponse({ status: 201, description: 'Listing saved successfully' })
  @ApiResponse({ status: 409, description: 'Listing already saved' })
  @ApiParam({ name: 'listingId', description: 'Listing ID' })
  save(@Request() req, @Param('listingId') listingId: string) {
    return this.savedListingsService.save(req.user.id, listingId);
  }

  @Delete(':listingId')
  @ApiOperation({ summary: 'Remove a saved listing (remove from wishlist)' })
  @ApiResponse({ status: 200, description: 'Listing removed from saved' })
  @ApiParam({ name: 'listingId', description: 'Listing ID' })
  unsave(@Request() req, @Param('listingId') listingId: string) {
    return this.savedListingsService.unsave(req.user.id, listingId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all saved listings for current user' })
  @ApiResponse({ status: 200, description: 'Returns saved listings' })
  getUserSavedListings(@Request() req) {
    return this.savedListingsService.getUserSavedListings(req.user.id);
  }

  @Get(':listingId/status')
  @ApiOperation({ summary: 'Check if a listing is saved' })
  @ApiResponse({ status: 200, description: 'Returns saved status' })
  @ApiParam({ name: 'listingId', description: 'Listing ID' })
  isSaved(@Request() req, @Param('listingId') listingId: string) {
    return this.savedListingsService.isSaved(req.user.id, listingId);
  }
}
