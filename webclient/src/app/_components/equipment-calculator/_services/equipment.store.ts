import { Injectable } from '@angular/core';
import {
    asyncScheduler,
    BehaviorSubject,
    catchError,
    concatMap,
    map,
    mergeMap,
    Observable,
    observeOn,
    of,
    startWith,
    Subject,
    take,
    tap,
} from 'rxjs';

import { EquipmentState, errorState, IDLE_STATE, LOADING_STATE } from '../_types/equipment-state';
import { EquipmentService } from '../../../_services/equipment.service';
import { Action } from '../../../_types/action';
import { Error } from '../../../_types/error';
import { UnitService } from '../../../_services/unit.service';
import { Unit } from '../../../_types/unit';
import { EquipmentSet } from '../../../_types/equipment-set';
import {
    CalculateEquipment,
    MarkForComparison,
    RemoveCompareSet,
    UpdateAttackElement,
    UpdateCarryWeight,
    UpdateDefenseElement,
    UpdateRanged,
    UpdateRangedForbidden,
    UpdateRangedRequired,
    UpdateSchmiedekunst,
    UpdateSelectedUnit,
    UpdateStatWeightingData,
    UpdateUnitElement,
    UpdateWaffenschmiede,
} from '../_types/equipment-calculator-action';
import { StatWeightingFormData } from '../_types/stat-weighting-form-data';
import { InvalidUnitError } from '../../../_types/invalid-unit-error';
import { Element } from '../../../_types/element';
import { StorageService } from '../../../_services/storage.service';
import { ErrorType } from '../../../_types/error-type';
import { ElementMismatchError } from '../../../_types/element-mismatch-error';
import { InvalidItemCombinationError } from '../../../_types/invalid-item-combination-error';

@Injectable()
export class EquipmentStore {
    state$: Observable<EquipmentState>;
    private _state$: BehaviorSubject<EquipmentState>;
    private _actions$: Subject<Action> = new Subject<Action>();

    constructor(
        private equipmentService: EquipmentService,
        private storageService: StorageService,
        private unitService: UnitService,
    ) {
        this._state$ = new BehaviorSubject<EquipmentState>(new EquipmentState());
        this.state$ = this._state$.asObservable().pipe(observeOn(asyncScheduler));
        this._actions$
            .pipe(
                observeOn(asyncScheduler),
                concatMap((action) => this.handleAction(action)),
            )
            .subscribe((stateUpdate) => this.updateState(stateUpdate));

        const savedWaffenschmiede = storageService.getWaffenschmiede();
        const savedSchmiedekunst = storageService.getSchmiedekunst();
        this.dispatch(new UpdateWaffenschmiede(savedWaffenschmiede), new UpdateSchmiedekunst(savedSchmiedekunst));
    }

    get state(): EquipmentState {
        return this._state$.getValue();
    }

    getEquipment(): void {
        this.dispatch(new CalculateEquipment());
    }

    updateStatWeighting(data: StatWeightingFormData): void {
        this.dispatch(new UpdateStatWeightingData(data));
    }

    updateCarryWeight(carryWeight: number): void {
        this.dispatch(new UpdateCarryWeight(carryWeight));
    }

    updateAttackElement(element: Element | undefined): void {
        this.dispatch(new UpdateAttackElement(element));
    }

    updateDefenseElement(element: Element | undefined): void {
        this.dispatch(new UpdateDefenseElement(element));
    }

    updateRanged(ranged: boolean): void {
        this.dispatch(new UpdateRanged(ranged));
    }

    updateRangedForbidden(rangedForbidden: boolean): void {
        this.dispatch(new UpdateRangedForbidden(rangedForbidden));
    }

    updateRangedRequired(rangedRequired: boolean): void {
        this.dispatch(new UpdateRangedRequired(rangedRequired));
    }

    updateSchmiedekunst(schmiedekunst: number): void {
        this.dispatch(new UpdateSchmiedekunst(schmiedekunst));
    }

    updateSelectedUnit(unitName: string | undefined): void {
        this.dispatch(new UpdateSelectedUnit(unitName));
    }

    updateUnitElement(element: Element): void {
        this.dispatch(new UpdateUnitElement(element));
    }

    updateWaffenschmiede(waffenschmiede: number): void {
        this.dispatch(new UpdateWaffenschmiede(waffenschmiede));
    }

    markForComparison(set: EquipmentSet): void {
        this.dispatch(new MarkForComparison(set));
    }

    removeCompareSet(): void {
        this.dispatch(new RemoveCompareSet());
    }

    private dispatch(...actions: Array<Action>): void {
        actions.forEach((action) => this._actions$.next(action));
    }

    private updateState(update: Partial<EquipmentState>): void {
        this.setState({ ...this.state, ...update });
    }

    private setState(state: EquipmentState): void {
        this._state$.next(state);
    }

    private onCalculateEquipment(): Observable<Partial<EquipmentState>> {
        return this.state$.pipe(
            take(1),
            mergeMap((state) => {
                return state.selectedUnit
                    ? this.equipmentService
                          .getEquipment(
                              state.selectedUnit,
                              state.carryWeight,
                              state.element,
                              state.ranged,
                              state.waffenschmiede,
                              state.rangedRequired,
                              state.rangedForbidden,
                              state.apWeight,
                              state.vpWeight,
                              state.hpWeight,
                              state.mpWeight,
                              state.elementAttack,
                              state.elementDefense,
                          )
                          .pipe(
                              take(1),
                              map((set: EquipmentSet) => ({
                                  set,
                                  ...IDLE_STATE,
                              })),
                              startWith(LOADING_STATE),
                              catchError((error: Error) => {
                                  console.error('Error calculating equipment set:', error);
                                  if (error.message === ErrorType.ELEMENT_MISMATCH) {
                                      return of(errorState(new ElementMismatchError()));
                                  } else if (error.message === ErrorType.INVALID_ITEM_COMBINATION) {
                                      return of(errorState(new InvalidItemCombinationError()));
                                  }
                                  return of(errorState(error));
                              }),
                          )
                    : this.errorState(new InvalidUnitError('Keine Einheit ausgewählt.'));
            }),
        );
    }

    private onUpdateWaffenschmiede(action: UpdateWaffenschmiede): Observable<Partial<EquipmentState>> {
        const { waffenschmiede } = action;
        return this.state$.pipe(
            take(1),
            map((state) => ({
                ...state,
                waffenschmiede,
            })),
            tap(() => {
                this.storageService.saveWaffenschmiede(waffenschmiede);
            }),
        );
    }

    private onUpdateSchmiedekunst(action: UpdateSchmiedekunst): Observable<Partial<EquipmentState>> {
        const { schmiedekunst } = action;
        return this.state$.pipe(
            take(1),
            map((state) => ({
                ...state,
                schmiedekunst,
            })),
            tap(() => {
                this.storageService.saveSchmiedekunst(schmiedekunst);
            }),
        );
    }

    private onUpdateStatWeightingData(action: UpdateStatWeightingData): Observable<Partial<EquipmentState>> {
        const { apWeight, vpWeight, hpWeight, mpWeight } = action.data;
        return this.state$.pipe(
            take(1),
            map((state) => ({
                ...state,
                apWeight,
                vpWeight,
                hpWeight,
                mpWeight,
                ...IDLE_STATE,
            })),
        );
    }

    private handleAction(action: Action): Observable<Partial<EquipmentState>> {
        if (action instanceof CalculateEquipment) return this.onCalculateEquipment();
        if (action instanceof UpdateStatWeightingData) return this.onUpdateStatWeightingData(action);
        if (action instanceof UpdateWaffenschmiede) return this.onUpdateWaffenschmiede(action);
        if (action instanceof UpdateSchmiedekunst) return this.onUpdateSchmiedekunst(action);
        if (action instanceof UpdateSelectedUnit) return this.onUpdateSelectedUnit(action);
        if (action instanceof UpdateCarryWeight) return this.onUpdateCarryWeight(action);
        if (action instanceof UpdateUnitElement) return this.onUpdateUnitElement(action);
        if (action instanceof UpdateRanged) return this.onUpdateRanged(action);
        if (action instanceof UpdateAttackElement) return this.onUpdateAttackElement(action);
        if (action instanceof UpdateDefenseElement) return this.onUpdateDefenseElement(action);
        if (action instanceof UpdateRangedRequired) return this.onUpdatedRangedRequired(action);
        if (action instanceof UpdateRangedForbidden) return this.onUpdateRangedForbidden(action);
        if (action instanceof MarkForComparison) return this.onMarkForComparison(action);
        if (action instanceof RemoveCompareSet) return this.onRemoveCompareSet();

        return of(IDLE_STATE);
    }

    private errorState(error: Error): Observable<Partial<EquipmentState>> {
        return this.state$.pipe(
            take(1),
            map((state) => ({ ...state, ...errorState(error) })),
        );
    }

    private onUpdateSelectedUnit(action: UpdateSelectedUnit): Observable<Partial<EquipmentState>> {
        return this.state$.pipe(
            take(1),
            mergeMap((state) => {
                if (!action.selectedUnit) {
                    return of({
                        ...state,
                        selectedUnit: undefined,
                        carryWeight: 0,
                        element: Element.NONE,
                        ranged: false,
                        rangedRequired: false,
                        rangedForbidden: false,
                    });
                }

                return this.unitService.getUnitByName(action.selectedUnit).pipe(
                    take(1),
                    map((unit: Unit | undefined) => ({
                        ...state,
                        selectedUnit: action.selectedUnit,
                        carryWeight: unit?.carryWeight || 0,
                        element: unit?.element || Element.NONE,
                        ranged: unit?.ranged || false,
                        rangedRequired: false,
                        rangedForbidden: false,
                    })),
                );
            }),
        );
    }

    private onUpdateCarryWeight(action: UpdateCarryWeight): Observable<Partial<EquipmentState>> {
        return this.state$.pipe(
            take(1),
            map((state) => ({
                ...state,
                carryWeight: action.carryWeight,
            })),
        );
    }

    private onUpdateUnitElement(action: UpdateUnitElement): Observable<Partial<EquipmentState>> {
        return this.state$.pipe(
            take(1),
            map((state) => ({
                ...state,
                element: action.element,
            })),
        );
    }

    private onUpdateRanged(action: UpdateRanged): Observable<Partial<EquipmentState>> {
        return this.state$.pipe(
            take(1),
            map((state) => ({
                ...state,
                ranged: action.ranged,
                rangedRequired: false,
                rangedForbidden: false,
            })),
        );
    }

    private onUpdateAttackElement(action: UpdateAttackElement): Observable<Partial<EquipmentState>> {
        return this.state$.pipe(
            take(1),
            map((state) => ({
                ...state,
                elementAttack: action.element,
            })),
        );
    }

    private onUpdateDefenseElement(action: UpdateDefenseElement): Observable<Partial<EquipmentState>> {
        return this.state$.pipe(
            take(1),
            map((state) => ({
                ...state,
                elementDefense: action.element,
            })),
        );
    }

    private onUpdatedRangedRequired(action: UpdateRangedRequired): Observable<Partial<EquipmentState>> {
        return this.state$.pipe(
            take(1),
            map((state) => ({
                ...state,
                rangedRequired: action.rangedRequired,
                rangedForbidden: false,
            })),
        );
    }

    private onUpdateRangedForbidden(action: UpdateRangedForbidden): Observable<Partial<EquipmentState>> {
        return this.state$.pipe(
            take(1),
            map((state) => ({
                ...state,
                rangedForbidden: action.rangedForbidden,
                rangedRequired: false,
            })),
        );
    }

    private onMarkForComparison(action: MarkForComparison): Observable<Partial<EquipmentState>> {
        return this.state$.pipe(
            take(1),
            map((state) => ({
                ...state,
                set: undefined,
                compareSet: action.set,
            })),
        );
    }

    private onRemoveCompareSet(): Observable<Partial<EquipmentState>> {
        return this.state$.pipe(
            take(1),
            map((state) => ({
                ...state,
                compareSet: undefined,
            })),
        );
    }
}
