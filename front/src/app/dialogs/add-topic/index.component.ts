import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

interface TopicBasicData {
    name: string;
    description: string
}

@Component({
  selector: 'add-topic-dialog',
  templateUrl: 'index.html'
})
export class AddTopicDialog  {

  constructor(
    public dialogRef: MatDialogRef<AddTopicDialog>,
    @Inject(MAT_DIALOG_DATA) public data: TopicBasicData
  ) { }

}
