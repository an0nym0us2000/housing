"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./modules/prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const listings_module_1 = require("./modules/listings/listings.module");
const amenities_module_1 = require("./modules/amenities/amenities.module");
const locations_module_1 = require("./modules/locations/locations.module");
const leads_module_1 = require("./modules/leads/leads.module");
const saved_listings_module_1 = require("./modules/saved-listings/saved-listings.module");
const visits_module_1 = require("./modules/visits/visits.module");
const teams_module_1 = require("./modules/teams/teams.module");
const tasks_module_1 = require("./modules/tasks/tasks.module");
const projects_module_1 = require("./modules/projects/projects.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            listings_module_1.ListingsModule,
            amenities_module_1.AmenitiesModule,
            locations_module_1.LocationsModule,
            leads_module_1.LeadsModule,
            saved_listings_module_1.SavedListingsModule,
            visits_module_1.VisitsModule,
            teams_module_1.TeamsModule,
            tasks_module_1.TasksModule,
            projects_module_1.ProjectsModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map