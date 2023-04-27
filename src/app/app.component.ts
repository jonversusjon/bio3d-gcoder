import { Component } from '@angular/core';
import { isWebSqlSupported, isIndexedDbSupported } from './_services/browser-support';
import { MatDialog } from '@angular/material/dialog';
import { ExportGcodeFormComponent } from './export-gcode-form/export-gcode-form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isSupported = false;
  message = '';

  constructor(public dialog: MatDialog) {}
  ngOnInit(): void {
    if (!isWebSqlSupported() && !isIndexedDbSupported()) {
      this.isSupported = false;
      this.message = 'Your browser does not support WebSQL or IndexedDB. Please use a modern browser to access this application.';
    } else {
      console.log('Browser meets requirements for SqlJs');
      this.isSupported = true;
    }
  }

  openExportGcodeForm(): void {
    const dialogRef = this.dialog.open(ExportGcodeFormComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
