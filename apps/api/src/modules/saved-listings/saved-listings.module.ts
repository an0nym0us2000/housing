import { Module } from '@nestjs/common';
import { SavedListingsController } from './saved-listings.controller';
import { SavedListingsService } from './saved-listings.service';

@Module({
  controllers: [SavedListingsController],
  providers: [SavedListingsService],
  exports: [SavedListingsService],
})
export class SavedListingsModule {}
