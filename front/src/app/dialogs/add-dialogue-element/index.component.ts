import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { DialogueElementType } from 'src/app/models/minute.model';

@Component({
  selector: 'add-dialogue-element-dialog',
  templateUrl: 'index.html'
})
export class AddDialogueElementDialog  {

    dialogueElementTypes  = ['Acuerdo', 'Compromiso', 'Duda', 'Desacuerdo']

  constructor(
    public dialogRef: MatDialogRef<AddDialogueElementDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogueElementType
  ) { }

}
