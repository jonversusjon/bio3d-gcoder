import { BrowserModule } from '@angular/platform-browser';
import {NgModule, Renderer2} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { PlateMapComponent } from './plate-map/plate-map.component';
import { Pipe, PipeTransform } from '@angular/core';
import { ScreenUtils } from "./_services/screen-utils";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { FloorPipe } from '../types/floor.pipe';
import { PrintHeadCardComponent } from './printhead-card/print-head-card.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from "@angular/material/select";
import { ExperimentSetupComponent } from './experiment-setup/experiment-setup.component';
import { MatButtonToggleModule} from "@angular/material/button-toggle";
import { PrintDepthComponent } from './print-depth/print-depth.component';
import { MatTooltipModule } from "@angular/material/tooltip";
import { VerticalSliderComponent } from './vertical-slider/vertical-slider.component';
import { NgOptimizedImage } from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import { RectangleSelectionComponent } from './rectangle-selection/rectangle-selection.component';
import { ExportGcodeFormComponent } from './export-gcode-form/export-gcode-form.component';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { PrintPositionPickerComponent } from './print-position-picker/print-position-picker.component';
import { PrintheadSetupComponent } from './printhead-setup/printhead-setup.component';
import { PrintheadNeedleSelectComponent } from './printhead-needle-select/printhead-needle-select.component';
import { PrintheadColorPickerComponent } from './printhead-color-picker/printhead-color-picker.component';
import { PrintheadTypeSelectComponent } from './printhead-type-select/printhead-type-select.component';


@Pipe({
  name: 'range'
})
export class RangePipe implements PipeTransform {
  transform(value: number): number[] {
    return Array.from({ length: value }, (_, i) => i + 1);
  }
}

@NgModule({
    declarations: [
        AppComponent,
        PlateMapComponent,
        RangePipe,
        FloorPipe,
        PrintHeadCardComponent,
        ExperimentSetupComponent,
        PrintDepthComponent,
        VerticalSliderComponent,
        RectangleSelectionComponent,
        ExportGcodeFormComponent,
        PrintPositionPickerComponent,
        PrintheadSetupComponent,
        PrintheadNeedleSelectComponent,
        PrintheadColorPickerComponent,
        PrintheadTypeSelectComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        BrowserAnimationsModule,
        MatGridListModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        MatSelectModule,
        MatButtonToggleModule,
        MatTooltipModule,
        NgOptimizedImage,
        MatDialogModule,
        MatButtonModule,
    ],
  providers: [
    ScreenUtils,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
