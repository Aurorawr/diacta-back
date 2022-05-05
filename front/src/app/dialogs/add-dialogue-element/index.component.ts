import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { DialogueElementType } from 'src/app/models/minute.model';

@Component({
  selector: 'add-dialogue-element-dialog',
  templateUrl: 'index.html'
})
export class AddDialogueElementDialog  {

  dialogueElementIcons  = {
    'Acuerdo': "assets/img/icons/agreement.png",
    'Compromiso': "assets/img/icons/promise.png",
    'Duda': "assets/img/icons/duda.png",
    'Desacuerdo': "assets/img/icons/discord.png"
  }

  constructor(
    public dialogRef: MatDialogRef<AddDialogueElementDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogueElementType
  ) { }



}
