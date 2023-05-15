import {Component, Input} from '@angular/core';
import {PrintheadTool} from "../../../types/PrintheadTool";

@Component({
  selector: 'app-suggested-ink-message',
  templateUrl: './suggested-ink-message.component.html',
  styleUrls: ['./suggested-ink-message.component.css']
})
export class SuggestedInkMessageComponent {
  @Input() selectedPrintheadTool!: PrintheadTool;

  constructor() {

  }
}
