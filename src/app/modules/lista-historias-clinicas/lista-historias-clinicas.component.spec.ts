import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaHistoriasClinicasComponent } from './lista-historias-clinicas.component';

describe('ListaHistoriasClinicasComponent', () => {
  let component: ListaHistoriasClinicasComponent;
  let fixture: ComponentFixture<ListaHistoriasClinicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaHistoriasClinicasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaHistoriasClinicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
