import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePreminuteComponent } from './create-preminute.component';

describe('CreatePreminuteComponent', () => {
  let component: CreatePreminuteComponent;
  let fixture: ComponentFixture<CreatePreminuteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePreminuteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePreminuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
