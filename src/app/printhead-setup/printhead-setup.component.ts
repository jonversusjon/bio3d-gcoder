import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Printhead {
  description: string;
  color: string;
  active: boolean;
}

@Component({
  selector: 'app-printhead-setup',
  templateUrl: './printhead-setup.component.html',
  styleUrls: ['./printhead-setup.component.css']
})
export class PrintheadSetupComponent implements OnInit {
  numberOfPrintheads: number = 1;
  printheads: Printhead[] = [];
  cols: number = 4;

  constructor() {
    this.updatePrintheads();
  }

  ngOnInit(): void {}

  updatePrintheads() {
    const newPrinthead: Printhead = {
      description: '',
      color: '#000000',
      active: true
    };

    if (this.numberOfPrintheads > this.printheads.length) {
      for (let i = this.printheads.length; i < this.numberOfPrintheads; i++) {
        this.printheads.push({ ...newPrinthead });
      }
    } else {
      this.printheads = this.printheads.slice(0, this.numberOfPrintheads);
    }
  }
}
