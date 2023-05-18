import {Component, Input, OnInit} from '@angular/core';
import {Printhead} from "../../../types/Printhead";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-printhead-emd-dispensing-time',
  templateUrl: './printhead-emd-dispensing-time.component.html',
  styleUrls: ['./printhead-emd-dispensing-time.component.css']
})
export class PrintheadEmdDispensingTimeComponent implements OnInit{
  @Input() printhead!: Printhead

  dispensingTimeControl!: FormControl;
  ngOnInit() {
    this.dispensingTimeControl = new FormControl(1);  // Replace 1 with your initial value
    this.dispensingTimeControl.valueChanges.subscribe((value) => {
      // Add any logic you want to execute when the value changes.
      console.log(value);
    });
  }
}
