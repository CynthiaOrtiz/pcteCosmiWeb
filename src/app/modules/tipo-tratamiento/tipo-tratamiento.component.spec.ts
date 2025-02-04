import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoTratamientoComponent } from './tipo-tratamiento.component';

describe('TipoTratamientoComponent', () => {
  let component: TipoTratamientoComponent;
  let fixture: ComponentFixture<TipoTratamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoTratamientoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoTratamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
