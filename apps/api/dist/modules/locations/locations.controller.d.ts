import { LocationsService } from './locations.service';
export declare class LocationsController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
    getCities(query?: string): Promise<any>;
    getCity(id: string): Promise<any>;
    getLocalities(cityId: string, query?: string): Promise<any>;
}
//# sourceMappingURL=locations.controller.d.ts.map