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
import { PrintHeadCardComponent } from './printhead-components/_printhead-card/print-head-card.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from "@angular/material/select";
import { ExperimentSetupComponent } from './experiment-setup/experiment-setup.component';
import { MatButtonToggleModule} from "@angular/material/button-toggle";
import { PrintDepthComponent } from './printhead-components/print-depth/print-depth.component';
import { MatTooltipModule } from "@angular/material/tooltip";
import { VerticalSliderComponent } from './vertical-slider/vertical-slider.component';
import { NgOptimizedImage } from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import { RectangleSelectionComponent } from './rectangle-selection/rectangle-selection.component';
import { ExportGcodeFormComponent } from './export-gcode-form/export-gcode-form.component';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { PrintPositionPickerComponent } from './printhead-components/print-position-picker/print-position-picker.component';
import { PrintheadSetupComponent } from './printhead-components/printhead-setup/printhead-setup.component';
import { PrintheadNeedleSelectComponent } from './printhead-components/printhead-needle-select/printhead-needle-select.component';
import { PrintheadColorPickerComponent } from './printhead-components/printhead-color-picker/printhead-color-picker.component';
import { PrintheadToolSelectComponent } from './printhead-components/printhead-tool-select/printhead-tool-select.component';
import {MatChipsModule} from "@angular/material/chips";
import { SuggestedInkMessageComponent } from './printhead-components/suggested-ink-message/suggested-ink-message.component';
import { PrintheadLedIntensityComponent } from './printhead-components/printhead-led-intensity/printhead-led-intensity.component';
import { PrintheadPressureComponent } from './printhead-components/printhead-pressure/printhead-pressure.component';
import { PrintheadEmdModeComponent } from './printhead-components/printhead-emd-mode/printhead-emd-mode.component';
import { PrintheadEmdValveOpenTimeComponent } from './printhead-components/printhead-emd-valve-open-time/printhead-emd-valve-open-time.component';
import { PrintheadEmdValveCycleTimeComponent } from './printhead-components/printhead-emd-valve-cycle-time/printhead-emd-valve-cycle-time.component';
import { PrintheadEmdDispensingTimeComponent } from './printhead-components/printhead-emd-dispensing-time/printhead-emd-dispensing-time.component';
import { PrintheadSyringeExtrusionRateComponent } from './printhead-components/printhead-syringe-extrusion-rate/printhead-syringe-extrusion-rate.component';
import { PrintheadSyringeExtrusionVolumeComponent } from './printhead-components/printhead-syringe-extrusion-volume/printhead-syringe-extrusion-volume.component';
import { PrintheadCameraFilenameComponent } from './printhead-components/printhead-camera-filename/printhead-camera-filename.component';
import { PrintheadToolOptionsComponent } from './printhead-components/printhead-tool-options/printhead-tool-options.component';
import { PrintheadLedWavelengthComponent } from './printhead-components/printhead-led-wavelength/printhead-led-wavelength.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PrintheadChipComponent } from './printhead-chip/printhead-chip.component';


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
        PrintheadToolSelectComponent,
        SuggestedInkMessageComponent,
        PrintheadLedIntensityComponent,
        PrintheadPressureComponent,
        PrintheadEmdModeComponent,
        PrintheadEmdValveOpenTimeComponent,
        PrintheadEmdValveCycleTimeComponent,
        PrintheadEmdDispensingTimeComponent,
        PrintheadSyringeExtrusionRateComponent,
        PrintheadSyringeExtrusionVolumeComponent,
        PrintheadCameraFilenameComponent,
        PrintheadToolOptionsComponent,
        PrintheadLedWavelengthComponent,
        PrintheadChipComponent
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
    MatChipsModule,
    ReactiveFormsModule
  ],
  providers: [
    ScreenUtils,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
