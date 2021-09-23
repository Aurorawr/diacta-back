import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

interface NoteBasicData {
    content: string;
}

@Component({
  selector: 'add-note-dialog',
  templateUrl: 'index.html'
})
export class AddNoteDialog  {

  constructor(
    public dialogRef: MatDialogRef<AddNoteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: NoteBasicData
  ) { }

}
