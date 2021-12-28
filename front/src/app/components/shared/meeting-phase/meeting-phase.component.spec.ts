import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingPhaseComponent } from './meeting-phase.component';

describe('MeetingPhaseComponent', () => {
  let component: MeetingPhaseComponent;
  let fixture: ComponentFixture<MeetingPhaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingPhaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingPhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
