import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

interface AnnexBasicData {
  url: string;
  name: string;
  description: string
}

@Component({
  selector: 'add-annex-dialog',
  templateUrl: 'index.html'
})
export class AddAnnexDialog  {

  constructor(
    public dialogRef: MatDialogRef<AddAnnexDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AnnexBasicData
  ) { }

}
