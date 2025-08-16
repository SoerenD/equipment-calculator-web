import { Element } from './element';
import { UnitType } from './unit-type';

export const CUSTOM_UNIT_NAME = 'Custom';

export interface Unit {
    name: string;
    type: UnitType;
    carryWeight: number;
    ranged: boolean;
    element: Element;
    kp: number;
    ap: number;
    vp: number;
    hp: number;
    mp: number;
}

// Legacy function for backward compatibility
export function unitByName(name: string | undefined, units: Map<string, Unit>): Unit | undefined {
    return name ? units.get(name) : undefined;
}
