import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {StyleService} from "../_services/style.service";
import {emptyPrintHead, PrintHead} from "../../types/PrintHead";
import {Subscription} from "rxjs";
import {PrintHeadStateService} from "../_services/print-head-state.service";

@Component({
  selector: 'app-printhead-setup',
  templateUrl: './printhead-setup.component.html',
  styleUrls: ['./printhead-setup.component.css']
})
export class PrintheadSetupComponent implements OnDestroy, OnInit {
  experimentSetupHeaderStyle: any;
  printHeadCountInput: number = 1;
  printHeads: PrintHead[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private styleService: StyleService,
              private printHeadStateService: PrintHeadStateService,
              private cd: ChangeDetectorRef) {
    this.subscriptions.push(
      this.printHeadStateService.printHeads$.subscribe((printHeads: PrintHead[]) => {
        console.log('printhead-setup-component received: ', printHeads);
        this.printHeads = printHeads;
      })
    );
    this.experimentSetupHeaderStyle = this.styleService.getBaseStyle('experiment-setup-header');

  }

  ngOnInit() {
    this.printHeadStateService.printHeads$.subscribe(printHeads => {
      console.log('printhead-card notified of printheads change');
      this.printHeads = [emptyPrintHead()];
      console.log('this.printHeads: ', this.printHeads);
      console.log('this.printHeads[0]: ', this.printHeads[0]); // Add this line
    });
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  onPrintHeadCountChange() {
    this.printHeadStateService.onPrintHeadCountChange(this.printHeadCountInput);
    this.cd.detectChanges();
  }



}
