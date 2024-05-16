import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTratamientoPacienteComponent } from './lista-tratamiento-paciente.component';

describe('ListaTratamientoPacienteComponent', () => {
  let component: ListaTratamientoPacienteComponent;
  let fixture: ComponentFixture<ListaTratamientoPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaTratamientoPacienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaTratamientoPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
