import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlateMapComponent } from './plate-map.component';
import {MatSelectChange} from "@angular/material/select";
import {PrintPositionService} from "../_services/print-position.service";

describe('PlateMapComponent', () => {
  let component: PlateMapComponent;
  let fixture: ComponentFixture<PlateMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlateMapComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PlateMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize PlateMapComponent correctly', () => {
    const fixture = TestBed.createComponent(PlateMapComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });


  it('should initialize printHeadsSubscription correctly on ngOnInit', () => {
    const fixture = TestBed.createComponent(PlateMapComponent);
    const app = fixture.componentInstance;
    app.ngOnInit();
    expect(app.printHeadsSubscription).toBeDefined();
  });


  it('should unsubscribe from printHeadsSubscription correctly on ngOnDestroy', () => {
    const fixture = TestBed.createComponent(PlateMapComponent);
    const app = fixture.componentInstance;
    app.ngOnInit();
    spyOn(app.printHeadsSubscription, 'unsubscribe');
    app.ngOnDestroy();
    expect(app.printHeadsSubscription.unsubscribe).toHaveBeenCalled();
  });


  it('should update the plate map correctly when onSelectedPlateChanged is called', () => {
    const fixture = TestBed.createComponent(PlateMapComponent);
    const app = fixture.componentInstance;
    const mockEvent: MatSelectChange = { value: app.plateFormats[1], source: null };
    spyOn(app, 'updatePlateMap');
    app.onSelectedPlateChanged(mockEvent);
    expect(app.updatePlateMap).toHaveBeenCalledWith(app.plateFormats[1]);
  });

  it('should call updatePlateMap and printPositionService.setSelectedPlate correctly when initializeSelectedPlate is called', () => {
    const fixture = TestBed.createComponent(PlateMapComponent);
    const app = fixture.componentInstance;
    spyOn(app, 'updatePlateMap');
    spyOn(app.printPositionService, 'setSelectedPlate');
    app.initializeSelectedPlate();
    expect(app.updatePlateMap).toHaveBeenCalledWith(app.selectedPlate);
    expect(app.printPositionService.setSelectedPlate).toHaveBeenCalledWith(app.selectedPlate);
  });

  it('should update plateMap.wells, plateMap.rowHeaders, and plateMap.columnHeaders correctly when updatePlateMap is called', () => {
    const fixture = TestBed.createComponent(PlateMapComponent);
    const app = fixture.componentInstance;
    const plate = app.plateFormats[1];
    app.updatePlateMap(plate);
    expect(app.plateMap.wells.length).toEqual(plate.rows);
    expect(app.plateMap.rowHeaders.length).toEqual(plate.rows);
    expect(app.plateMap.columnHeaders.length).toEqual(plate.cols);
  });


});
