import { Component, Inject, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

interface AnnexBasicData {
  annex: {
    _id?: string;
    url: string;
    name: string;
    description: string;
  }
  onEdit?: EventEmitter<any>
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

  onEdit(event: KeyboardEvent, annexAttribute: 'url' | 'name' | 'description') {
    if (this.data.onEdit) {
      const target = event.target as HTMLTextAreaElement;
      const value = target.value;
      const annexData:any = {}
      annexData[annexAttribute] = value
      this.data.onEdit.emit(annexData)
    }
  }

}
