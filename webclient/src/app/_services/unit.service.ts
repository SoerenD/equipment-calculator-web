import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, catchError, of, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { ApiService } from './api.service';
import { Unit, CUSTOM_UNIT_NAME } from '../_types/unit';
import { UnitJson } from '../_types/unit-json';
import { Element } from '../_types/element';
import { UnitType } from '../_types/unit-type';

/**
 * Service for managing unit data with multiple fallback mechanisms:
 * 1. First tries to load from HTTP API endpoint (/item/units_json)
 * 2. If API fails, falls back to local JSON file (assets/units.json)
 * 3. If both fail, uses hardcoded fallback data
 */
@Injectable({
    providedIn: 'root',
})
export class UnitService {
    private unitsSubject = new BehaviorSubject<Map<string, Unit> | null>(null);
    private isLoading = false;

    constructor(private apiService: ApiService, private http: HttpClient) {}

    /**
     * Get all units as an Observable
     */
    getUnits(): Observable<Map<string, Unit>> {
        if (this.unitsSubject.value === null && !this.isLoading) {
            this.loadUnits();
        }
        return this.unitsSubject.asObservable().pipe(
            map(units => units || this.getHardcodedFallbackUnits())
        );
    }

    /**
     * Get unit by name
     */
    getUnitByName(name: string): Observable<Unit | undefined> {
        return this.getUnits().pipe(
            map(units => units.get(name))
        );
    }

    /**
     * Load units from API endpoint
     */
    private loadUnits(): void {
        this.isLoading = true;
        
        this.apiService.get<UnitJson[]>('/item/units_json')
            .pipe(
                map(unitJsonList => this.mapJsonToUnits(unitJsonList)),
                catchError(error => {
                    console.warn('Failed to load units from API, trying local fallback file:', error);
                    return this.http.get<UnitJson[]>('assets/units.json').pipe(
                        map(unitJsonList => this.mapJsonToUnits(unitJsonList)),
                        catchError(fallbackError => {
                            console.error('Failed to load units from fallback file, using hardcoded data:', fallbackError);
                            return of(this.getHardcodedFallbackUnits());
                        })
                    );
                })
            )
            .subscribe(units => {
                this.unitsSubject.next(units);
                this.isLoading = false;
            });
    }

    /**
     * Map JSON units to Unit objects
     */
    private mapJsonToUnits(unitJsonList: UnitJson[]): Map<string, Unit> {
        const units = new Map<string, Unit>();

        // Always add the custom unit first
        units.set(CUSTOM_UNIT_NAME, this.createCustomUnit());

        unitJsonList.forEach(unitJson => {
            if (unitJson.lang_unit) {
                const unit = this.mapJsonToUnit(unitJson);
                units.set(unit.name, unit);
            }
        });

        return units;
    }

    /**
     * Map single UnitJson to Unit
     */
    private mapJsonToUnit(unitJson: UnitJson): Unit {
        return {
            name: unitJson.lang_unit,
            type: this.mapStringToUnitType(unitJson.typ_var),
            carryWeight: unitJson.kraft,
            ranged: unitJson.FK > 0,
            element: this.mapIntToElement(unitJson.element),
            kp: unitJson.kommando,
            ap: unitJson.ap,
            vp: unitJson.vp,
            hp: unitJson.hp,
            mp: unitJson.mp
        };
    }

    /**
     * Map string to UnitType enum
     */
    private mapStringToUnitType(typVar: string): UnitType {
        switch (typVar) {
            case 'SPECIES_HUMAN':
                return UnitType.HUMAN;
            case 'SPECIES_UNDEAD':
                return UnitType.UNDEAD;
            case 'SPECIES_DEMON':
                return UnitType.DEMON;
            case 'SPECIES_ELEMENTAL':
                return UnitType.ELEMENTAL;
            case 'SPECIES_GHOST':
                return UnitType.GHOST;
            default:
                return UnitType.NONE;
        }
    }

    /**
     * Map integer to Element enum (similar to backend logic)
     */
    private mapIntToElement(elementInt: number): Element {
        switch (elementInt) {
            case 0:
                return Element.NONE;
            case 1:
            case 256:
            case 257:
                return Element.FIRE;
            case 2:
            case 512:
            case 514:
                return Element.ICE;
            case 4:
            case 1024:
            case 1028:
                return Element.AIR;
            case 8:
            case 2048:
            case 2056:
                return Element.EARTH;
            default:
                // Handle combinations or unknown values
                let hasfire = false;
                let hasIce = false;
                let hasAir = false;
                let hasEarth = false;

                if ((elementInt & 1) !== 0 || (elementInt & 256) !== 0) hasfire = true;
                if ((elementInt & 2) !== 0 || (elementInt & 512) !== 0) hasIce = true;
                if ((elementInt & 4) !== 0 || (elementInt & 1024) !== 0) hasAir = true;
                if ((elementInt & 8) !== 0 || (elementInt & 2048) !== 0) hasEarth = true;

                if (hasfire && hasAir) return Element.FIRE_AIR;
                if (hasEarth && hasIce) return Element.EARTH_ICE;
                if (hasfire) return Element.FIRE;
                if (hasIce) return Element.ICE;
                if (hasAir) return Element.AIR;
                if (hasEarth) return Element.EARTH;
                return Element.NONE;
        }
    }

    /**
     * Create the custom unit
     */
    private createCustomUnit(): Unit {
        return {
            name: CUSTOM_UNIT_NAME,
            type: UnitType.NONE,
            carryWeight: 0,
            ranged: true,
            element: Element.NONE,
            kp: 0,
            ap: 0,
            vp: 0,
            hp: 0,
            mp: 0
        };
    }

    /**
     * Hardcoded fallback units (last resort if both API and local file fail)
     */
    private getHardcodedFallbackUnits(): Map<string, Unit> {
        const units: Array<Unit> = [
            this.createCustomUnit(),
            this.createUnit("Späher", UnitType.HUMAN, 20, true, Element.NONE, 10, 30, 55, 32, 0),
            this.createUnit("Kreuzritter", UnitType.HUMAN, 160, false, Element.NONE, 25, 120, 75, 215, 0),
            this.createUnit("Drachenjäger", UnitType.HUMAN, 270, true, Element.NONE, 40, 300, 120, 300, 0),
            this.createUnit("Pikenier", UnitType.HUMAN, 350, false, Element.NONE, 60, 1050, 350, 540, 0),
            this.createUnit("Erzengel", UnitType.HUMAN, 430, false, Element.AIR, 80, 780, 640, 930, 200),
            this.createUnit("Titan", UnitType.HUMAN, 580, false, Element.EARTH, 120, 900, 3600, 4700, 0),
            this.createUnit("Lich", UnitType.UNDEAD, 170, false, Element.NONE, 60, 155, 120, 195, 30),
            this.createUnit("Knochendrache", UnitType.UNDEAD, 200, true, Element.NONE, 200, 0, 0, 0, 0),
            this.createUnit("Teufel", UnitType.UNDEAD, 360, false, Element.NONE, 90, 1000, 1400, 1500, 0),
            this.createUnit("Ifrit", UnitType.UNDEAD, 650, false, Element.NONE, 210, 1930, 4000, 2550, 0),
            this.createUnit("Daktyle", UnitType.DEMON, 250, false, Element.NONE, 80, 1000, 775, 1050, 300),
            this.createUnit("Jötun", UnitType.DEMON, 200, true, Element.NONE, 140, 1420, 800, 1425, 0),
            this.createUnit("Thurse", UnitType.DEMON, 650, false, Element.EARTH, 240, 5515, 5185, 4985, 0),
            this.createUnit("Tyr", UnitType.DEMON, 1230, false, Element.NONE, 300, 6200, 5200, 7200, 0),
            this.createUnit("Eiselementar", UnitType.ELEMENTAL, 200, false, Element.ICE, 50, 670, 570, 840, 150),
            this.createUnit("Luftelementar", UnitType.ELEMENTAL, 200, true, Element.AIR, 50, 2700, 2500, 2390, 0),
            this.createUnit("Feuerelementar", UnitType.ELEMENTAL, 200, true, Element.FIRE, 50, 2700, 2500, 2390, 0),
            this.createUnit("Erdelementar", UnitType.ELEMENTAL, 200, true, Element.EARTH, 50, 2700, 2500, 2390, 0),
            this.createUnit("Banshee", UnitType.GHOST, 150, false, Element.AIR, 100, 245, 1950, 3000, 625),
            this.createUnit("Hüter des Silberhains", UnitType.HUMAN, 350, false, Element.NONE, 125, 2480, 1700, 4000, 0),
            this.createUnit("Harlekin", UnitType.DEMON, 200, true, Element.NONE, 50, 2350, 1950, 2150, 0),
            this.createUnit("Varsillischer Riese", UnitType.HUMAN, 650, false, Element.EARTH, 75, 2150, 2200, 4800, 0)
        ];

        return new Map(units.map((unit) => [unit.name, unit]));
    }

    /**
     * Helper method to create units
     */
    private createUnit(
        name: string,
        type: UnitType,
        carryWeight: number,
        ranged: boolean,
        element: Element,
        kp: number,
        ap: number,
        vp: number,
        hp: number,
        mp: number
    ): Unit {
        return {
            name,
            type,
            carryWeight,
            ranged,
            element,
            kp,
            ap,
            vp,
            hp,
            mp
        };
    }

    /**
     * Refresh units data from API
     */
    refreshUnits(): void {
        this.unitsSubject.next(null);
        this.loadUnits();
    }

    /**
     * Get data source information for debugging
     */
    getDataSource(): Observable<string> {
        return this.apiService.get<UnitJson[]>('/item/units_json').pipe(
            map(() => 'HTTP API Endpoint'),
            catchError(() => {
                return this.http.get<UnitJson[]>('assets/units.json').pipe(
                    map(() => 'Local File (assets/units.json)'),
                    catchError(() => of('Hardcoded Fallback Data'))
                );
            })
        );
    }
}
