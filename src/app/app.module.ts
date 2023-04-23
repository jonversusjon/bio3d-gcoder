import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { PlateMapComponent } from './plate-map/plate-map.component';
import { Pipe, PipeTransform } from '@angular/core';
import { ScreenUtils } from "./screen-utils";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { FloorPipe } from '../types/floor.pipe';
import { PrintheadComponent } from './printhead-component/printhead.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from "@angular/material/select";
import { ExperimentSetupComponent } from './experiment-setup/experiment-setup.component';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import { PrintDepthComponent } from './print-depth/print-depth.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from "@angular/material/tooltip";
import { CustomSliderComponent } from './custom-slider/custom-slider.component';

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
        PrintheadComponent,
        ExperimentSetupComponent,
        PrintDepthComponent,
        CustomSliderComponent
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
        MatSliderModule,
        MatTooltipModule
    ],
  providers: [ScreenUtils],
  bootstrap: [AppComponent]
})
export class AppModule { }
