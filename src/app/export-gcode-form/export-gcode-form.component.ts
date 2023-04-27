import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-export-gcode-form',
  templateUrl: './export-gcode-form.component.html',
  styleUrls: ['./export-gcode-form.component.css']
})
export class ExportGcodeFormComponent {
  constructor(
    public dialogRef: MatDialogRef<ExportGcodeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}



  generateGcode(): void {
    // logic to generate Gcode
  }

  cancel(): void {
    // logic to cancel modal
  }

  close(): void {
    this.dialogRef.close();
  }
}
