"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedListingsModule = void 0;
const common_1 = require("@nestjs/common");
const saved_listings_controller_1 = require("./saved-listings.controller");
const saved_listings_service_1 = require("./saved-listings.service");
let SavedListingsModule = class SavedListingsModule {
};
exports.SavedListingsModule = SavedListingsModule;
exports.SavedListingsModule = SavedListingsModule = __decorate([
    (0, common_1.Module)({
        controllers: [saved_listings_controller_1.SavedListingsController],
        providers: [saved_listings_service_1.SavedListingsService],
        exports: [saved_listings_service_1.SavedListingsService],
    })
], SavedListingsModule);
//# sourceMappingURL=saved-listings.module.js.map