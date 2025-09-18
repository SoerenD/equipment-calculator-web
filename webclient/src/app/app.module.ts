import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';

import { AppComponent } from './app.component';
import { AboutDialogComponent } from './_components/about-dialog/about-dialog.component';
import { HelpDialogComponent } from './_components/help-dialog/help-dialog.component';
import { EquipmentSetComponent } from './_components/equipment-calculator/_components/equipment-set/equipment-set.component';
import { StatWeightingComponent } from './_components/equipment-calculator/_components/stat-weighting/stat-weighting.component';
import { BaseDataInputComponent } from './_components/equipment-calculator/_components/base-data-input/base-data-input.component';
import { AppRoutingModule } from './app-routing.module';
import { EquipmentCalculatorComponent } from './_components/equipment-calculator/equipment-calculator.component';
import { ContextComponent } from './_components/context/context.component';

@NgModule({
    declarations: [
        AppComponent,
        AboutDialogComponent,
        HelpDialogComponent,
        ContextComponent,
        EquipmentCalculatorComponent,
        BaseDataInputComponent,
        StatWeightingComponent,
        EquipmentSetComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatCardModule,
        MatSliderModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        RouterModule,
        AppRoutingModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatChipsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
