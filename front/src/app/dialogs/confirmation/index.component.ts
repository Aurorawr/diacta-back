import { Component, EventEmitter, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

interface ConfirmationData {
  confirmationMessage: string;
  callback: EventEmitter<any>;
  noCancel?: boolean
}

@Component({
  selector: 'app-add-member-dialog',
  templateUrl: './index.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ConfirmationDialogComponent  {

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationData
  ) { }

}
