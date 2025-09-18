import { Action } from '../../../_types/action';
import { Element } from '../../../_types/element';
import { EquipmentSet } from '../../../_types/equipment-set';

import { StatWeightingFormData } from './stat-weighting-form-data';

export class UpdateWaffenschmiede extends Action {
    constructor(public waffenschmiede: number) {
        super();
    }
}

export class UpdateSchmiedekunst extends Action {
    constructor(public schmiedekunst: number) {
        super();
    }
}

export class UpdateSelectedUnit extends Action {
    constructor(public selectedUnit?: string) {
        super();
    }
}

export class UpdateCarryWeight extends Action {
    constructor(public carryWeight: number) {
        super();
    }
}

export class UpdateUnitElement extends Action {
    constructor(public element: Element) {
        super();
    }
}

export class UpdateRanged extends Action {
    constructor(public ranged: boolean) {
        super();
    }
}

export class UpdateRangedRequired extends Action {
    constructor(public rangedRequired: boolean) {
        super();
    }
}

export class UpdateRangedForbidden extends Action {
    constructor(public rangedForbidden: boolean) {
        super();
    }
}

export class UpdateAttackElement extends Action {
    constructor(public element?: Element) {
        super();
    }
}

export class UpdateDefenseElement extends Action {
    constructor(public element?: Element) {
        super();
    }
}

export class CalculateEquipment extends Action {}

export class UpdateStatWeightingData extends Action {
    constructor(public data: StatWeightingFormData) {
        super();
    }
}

export class MarkForComparison extends Action {
    constructor(public set: EquipmentSet) {
        super();
    }
}

export class RemoveCompareSet extends Action {}

export class AddIgnoredItem extends Action {
    constructor(public itemName: string) {
        super();
    }
}

export class RemoveIgnoredItem extends Action {
    constructor(public itemName: string) {
        super();
    }
}

export class ClearIgnoredItems extends Action {}
