// this is output from chatgpt that i'm not ready to implement yet but want to hold on to it

// TODO: concentric rings for multiple printheads that print in the same spot

// plate-map-component.html
//<!-- ... -->
// <div *ngFor="let well of plateRow; let rw = index"
// class="printhead-print-position-picker"
//   [ngStyle]="well.style"
//   [ngClass]="{'selected-well': well.selected, 'unselected-well': !well.selected, 'base-well-style': true}"
// (click)="toggleWellSelection(i,rw)">
// <ng-container *ngFor="let printHead of printHeads">
// <ng-container *ngFor="let button of printHead.printPositionButtons; let buttonIndex = index">
// <div *ngIf="well.selected && button.selected"
//   [ngStyle]="getPrintPositionStyle(printHead, button)"
//   [class.standard-print-position]="isStandardPrintPosition(printHead, button)"
//   [style.border]="getPrintPositionBorder(printHead, button)">
//   </div>
//   </ng-container>
//   </ng-container>
//   </div>
// <!-- ... -->

// plate-map-component.css
// .standard-print-position {
//   position: absolute;
//   border-radius: 50%;
// }

//plate-map-component.ts
// ...
// export class PlateMapComponent implements OnInit, OnDestroy {
//   // ...
//
//   isStandardPrintPosition(printHead: any, button: any): boolean {
//     // Check if the current print position is the standard one
//     const sameOriginPrintPositions = this.getPrintPositionsByOrigin(printHead, button);
//     return printHead === sameOriginPrintPositions[sameOriginPrintPositions.length - 1];
//   }
//
//   getPrintPositionsByOrigin(printHead: any, button: any): any[] {
//     // Find all print positions with the same origin
//     return this.printHeads.filter(ph =>
//       ph.printPositionButtons.some(
//         b => b.selected && b.origin === button.origin,
//       ),
//     );
//   }
//
//   getPrintPositionStyle(printHead: any, button: any): object {
//     const baseStyle = {
//       // Add any common styles for the print positions here
//     };
//
//     if (this.isStandardPrintPosition(printHead, button)) {
//       return {
//         ...baseStyle,
//         'background-color': printHead.color,
//       };
//     }
//
//     return baseStyle;
//   }
//
//   getPrintPositionBorder(printHead: any, button: any): string {
//     if (!this.isStandardPrintPosition(printHead, button)) {
//       const sameOriginPrintPositions = this.getPrintPositionsByOrigin(printHead, button);
//       const index = sameOriginPrintPositions.findIndex(ph => ph === printHead);
//       const borderWidth = 2 * (index + 1);
//       return `${borderWidth}px solid ${printHead.color}`;
//     }
//
//     return '';
//   }
//
//   // ...rest of the component
// }
 //notes: This implementation adds three new methods to the PlateMapComponent class:
//
// isStandardPrintPosition(printHead, button) checks if the current print position should be rendered as the standard one based on your conditions.
// getPrintPositionsByOrigin(printHead, button) returns an array of print positions with the same origin, sorted by their indices.
// getPrintPositionStyle(printHead, button) returns the style object for the print position.
// getPrintPositionBorder(printHead, button) returns the border style string for the print position.
