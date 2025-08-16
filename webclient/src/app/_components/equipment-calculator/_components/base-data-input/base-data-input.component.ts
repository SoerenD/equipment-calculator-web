import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { Element, elements } from 'src/app/_types/element';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';

import { UnitService } from '../../../../_services/unit.service';
import { InvalidInputError } from '../../../../_types/invalid-input-error';

@Component({
    selector: 'app-base-data-input',
    templateUrl: './base-data-input.component.html',
    styleUrls: ['./base-data-input.component.scss'],
})
export class BaseDataInputComponent implements OnInit, OnDestroy {
    @Input() waffenschmiede = 0;
    @Input() schmiedekunst = 0;
    @Input() selectedUnit?: string;
    @Input() unitElement = Element.NONE;
    @Input() carryWeight = 0;
    @Input() ranged = false;
    @Input() elementAttack?: Element;
    @Input() elementDefense?: Element;
    @Input() rangedRequired = false;
    @Input() rangedForbidden = false;
    @Output() waffenschmiedeChanged = new EventEmitter<number>();
    @Output() schmiedekunstChanged = new EventEmitter<number>();
    @Output() selectedUnitChanged = new EventEmitter<string | undefined>();
    @Output() unitElementChanged = new EventEmitter<Element>();
    @Output() carryWeightChanged = new EventEmitter<number>();
    @Output() rangedChanged = new EventEmitter<boolean>();
    @Output() elementAttackChanged = new EventEmitter<Element | undefined>();
    @Output() elementDefenseChanged = new EventEmitter<Element | undefined>();
    @Output() rangedRequiredChanged = new EventEmitter<boolean>();
    @Output() rangedForbiddenChanged = new EventEmitter<boolean>();

    allUnits: string[] = [];
    elements = elements;
    private unitsSubscription?: Subscription;

    constructor(private unitService: UnitService) {}

    ngOnInit(): void {
        this.unitsSubscription = this.unitService.getUnits().subscribe((units) => {
            this.allUnits = [...units.keys()];
        });
    }

    ngOnDestroy(): void {
        if (this.unitsSubscription) {
            this.unitsSubscription.unsubscribe();
        }
    }

    unitName(index: number, name: string): string {
        return name;
    }

    onWaffenschmiedeChanged(value: string): void {
        const intValue = Number.parseInt(value);
        isNaN(intValue)
            ? this.waffenschmiedeChanged.error(new InvalidInputError(`${value} is not a number.`))
            : this.waffenschmiedeChanged.emit(intValue);
    }

    onSchmiedekunstChanged(value: string): void {
        const intValue = Number.parseInt(value);
        isNaN(intValue)
            ? this.schmiedekunstChanged.error(new InvalidInputError(`${value} is not a number.`))
            : this.schmiedekunstChanged.emit(intValue);
    }

    onSelectedUnitChanged(unitName: string | undefined): void {
        this.selectedUnitChanged.emit(unitName);
    }

    onUnitElementChanged(element: Element): void {
        this.unitElementChanged.emit(element);
    }

    onAttackElementChanged(element: Element | undefined): void {
        this.elementAttackChanged.emit(element);
    }

    onDefenseElementChanged(element: Element | undefined): void {
        this.elementDefenseChanged.emit(element);
    }

    onCarryWeightChanged(value: string): void {
        const intValue = Number.parseInt(value);
        isNaN(intValue)
            ? this.carryWeightChanged.error(new InvalidInputError(`${value} is not a number.`))
            : this.carryWeightChanged.emit(intValue);
    }

    onRangedChanged(change: MatCheckboxChange): void {
        this.rangedChanged.emit(change.checked);
    }

    onRangedRequiredChanged(change: MatCheckboxChange): void {
        this.rangedRequiredChanged.emit(change.checked);
    }

    onRangedForbiddenChanged(change: MatCheckboxChange): void {
        this.rangedForbiddenChanged.emit(change.checked);
    }
}
