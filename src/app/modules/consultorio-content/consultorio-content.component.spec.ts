import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultorioContentComponent } from './consultorio-content.component';

describe('ConsultorioContentComponent', () => {
  let component: ConsultorioContentComponent;
  let fixture: ComponentFixture<ConsultorioContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultorioContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultorioContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
