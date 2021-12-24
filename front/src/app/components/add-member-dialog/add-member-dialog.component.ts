import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

interface UserCreateData {
  name: string;
  lastname?: string;
  email: string;
  password: string;
  cellphone: string;
  isAdmin: false
}

@Component({
  selector: 'app-add-member-dialog',
  templateUrl: './add-member-dialog.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AddMemberDialogComponent  {

  hidePassword:boolean = true

  constructor(
    public dialogRef: MatDialogRef<AddMemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserCreateData
  ) { }

}
