import { Component, Self } from '@angular/core';
import { distinctUntilChanged, filter, map } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CompositeSubscription } from '../../_types/composite-subscription';
import { Element } from '../../_types/element';
import { EquipmentSet } from '../../_types/equipment-set';

import { EquipmentStore } from './_services/equipment.store';
import { StatWeightingFormData } from './_types/stat-weighting-form-data';

@Component({
    selector: 'app-equipment-calculator',
    templateUrl: './equipment-calculator.component.html',
    styleUrls: ['./equipment-calculator.component.scss'],
    providers: [EquipmentStore],
})
export class EquipmentCalculatorComponent {
    subscriptions = new CompositeSubscription();

    constructor(
        @Self() public store: EquipmentStore,
        private snackbar: MatSnackBar,
    ) {
        this.subscriptions.add(
            store.state$
                .pipe(
                    map(({ status }) => status),
                    distinctUntilChanged(),
                    filter((status) => !!status.error),
                )
                .subscribe((status) => {
                    this.snackbar.open(`Da ist was schief gegangen: ${status.error?.message}`, '', { duration: 5000 });
                }),
        );
    }

    calculateEquipment(): void {
        this.store.getEquipment();
    }

    onStatWeightingDataChanged(data: StatWeightingFormData): void {
        this.store.updateStatWeighting(data);
    }

    onCarryWeightChanged(carryWeight: number): void {
        this.store.updateCarryWeight(carryWeight);
    }

    onElementAttackChanged(element: Element | undefined): void {
        this.store.updateAttackElement(element);
    }

    onElementDefenseChanged(element: Element | undefined): void {
        this.store.updateDefenseElement(element);
    }

    onRangedChanged(ranged: boolean): void {
        this.store.updateRanged(ranged);
    }

    onRangedForbiddenChanged(rangedForbidden: boolean): void {
        this.store.updateRangedForbidden(rangedForbidden);
    }

    onRangedRequiredChanged(rangedRequired: boolean): void {
        this.store.updateRangedRequired(rangedRequired);
    }

    onSchmiedekunstChanged(schmiedekunst: number): void {
        this.store.updateSchmiedekunst(schmiedekunst);
    }

    onSelectedUnitChanged(unitName: string | undefined): void {
        this.store.updateSelectedUnit(unitName);
    }

    onUnitElementChanged(element: Element): void {
        this.store.updateUnitElement(element);
    }

    onWaffenschmiedeChanged(waffenschmiede: number): void {
        this.store.updateWaffenschmiede(waffenschmiede);
    }

    markForComparison(set: EquipmentSet): void {
        this.store.markForComparison(set);
    }

    removeCompareSet(): void {
        this.store.removeCompareSet();
    }
}
