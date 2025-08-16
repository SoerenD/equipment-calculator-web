import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { tap } from 'rxjs';

import { NUMBERS_ONLY } from '../../../../_util/validators';
import { CompositeSubscription } from '../../../../_types/composite-subscription';
import { StatWeightingFormData } from '../../_types/stat-weighting-form-data';

@Component({
    selector: 'app-stat-weighting',
    templateUrl: './stat-weighting.component.html',
    styleUrls: ['./stat-weighting.component.scss'],
})
export class StatWeightingComponent implements OnInit, OnDestroy {
    @Output() changed = new EventEmitter<StatWeightingFormData>();

    form = new FormGroup({
        apWeight: new FormControl(0, [NUMBERS_ONLY]),
        vpWeight: new FormControl(0, [NUMBERS_ONLY]),
        hpWeight: new FormControl(0, [NUMBERS_ONLY]),
        mpWeight: new FormControl(0, [NUMBERS_ONLY]),
    });

    subscriptions = new CompositeSubscription();

    ngOnInit(): void {
        this.subscriptions.add(
            this.form.valueChanges
                .pipe(
                    tap((changes) => {
                        this.changed.emit({
                            apWeight: changes.apWeight || 0,
                            vpWeight: changes.vpWeight || 0,
                            hpWeight: changes.hpWeight || 0,
                            mpWeight: changes.mpWeight || 0,
                        });
                    }),
                )
                .subscribe(),
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
