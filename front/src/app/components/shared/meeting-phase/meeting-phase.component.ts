import { Component, Input } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-meeting-phase',
  templateUrl: './meeting-phase.component.html',
  styleUrls: ['./meeting-phase.component.scss']
})
export class MeetingPhaseComponent {

  @Input() phase = 0
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });

  constructor(private _formBuilder: FormBuilder) { }

}
