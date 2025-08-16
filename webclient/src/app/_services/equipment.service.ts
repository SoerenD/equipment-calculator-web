import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EquipmentSet } from '../_types/equipment-set';
import { Cache } from '../_types/cache';
import { cached } from '../_util/operators';
import { Element } from '../_types/element';

import { CacheService } from './cache.service';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root',
})
export class EquipmentService {
    private equipmentCache: Cache<EquipmentSet>;

    constructor(
        private apiService: ApiService,
        cacheService: CacheService,
    ) {
        this.equipmentCache = cacheService.get<EquipmentSet>('equipmentCache');
    }

    private static getCacheKey(...objects: Array<unknown>): string {
        return objects.join(':');
    }

    getEquipment(
        unitName: string,
        carryWeight: number,
        element: Element,
        ranged: boolean,
        waffenschmiede: number,
        rangedRequired: boolean,
        rangedForbidden: boolean,
        apWeight: number,
        vpWeight: number,
        hpWeight: number,
        mpWeight: number,
        elementAttack?: Element,
        elementDefense?: Element,
    ): Observable<EquipmentSet> {
        const cacheKey = EquipmentService.getCacheKey(
            carryWeight,
            element,
            ranged,
            waffenschmiede,
            rangedRequired,
            rangedForbidden,
            apWeight,
            vpWeight,
            hpWeight,
            mpWeight,
            elementAttack,
            elementDefense,
        );

        return this.apiService
            .get<EquipmentSet>('/', {
                unitCarryWeight: carryWeight,
                unitElement: element,
                unitRanged: ranged,
                waffenschmiede,
                rangedRequired,
                rangedForbidden,
                elementAttack,
                elementDefense,
                apWeight,
                vpWeight,
                hpWeight,
                mpWeight,
            })
            .pipe(cached(this.equipmentCache, cacheKey));
    }
}
