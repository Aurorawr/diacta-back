import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMinuteComponent } from './edit-minute.component';

describe('CreatePreminuteComponent', () => {
  let component: EditMinuteComponent;
  let fixture: ComponentFixture<EditMinuteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMinuteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMinuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
