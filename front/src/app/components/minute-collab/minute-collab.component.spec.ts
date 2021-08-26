import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinuteCollabComponent } from './minute-collab.component';

describe('MinuteCollabComponent', () => {
  let component: MinuteCollabComponent;
  let fixture: ComponentFixture<MinuteCollabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinuteCollabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinuteCollabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
