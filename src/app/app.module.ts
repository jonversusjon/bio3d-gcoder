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
import { PrintheadSetupComponent } from './printhead-setup/printhead-setup.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

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
        PrintheadSetupComponent
    ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule
  ],
  providers: [ScreenUtils],
  bootstrap: [AppComponent]
})
export class AppModule { }