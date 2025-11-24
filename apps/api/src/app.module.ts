import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ListingsModule } from './modules/listings/listings.module';
import { AmenitiesModule } from './modules/amenities/amenities.module';
import { LocationsModule } from './modules/locations/locations.module';
import { LeadsModule } from './modules/leads/leads.module';
import { SavedListingsModule } from './modules/saved-listings/saved-listings.module';
import { VisitsModule } from './modules/visits/visits.module';
import { TeamsModule } from './modules/teams/teams.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { RemindersModule } from './modules/reminders/reminders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ListingsModule,
    AmenitiesModule,
    LocationsModule,
    LeadsModule,
    SavedListingsModule,
    VisitsModule,
    TeamsModule,
    TasksModule,
    ProjectsModule,
    NotificationsModule,
    RemindersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
