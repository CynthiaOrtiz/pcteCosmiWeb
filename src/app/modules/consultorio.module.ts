import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegistroPacienteComponent } from './registro-paciente/registro-paciente.component';
import { ConsultorioRoutingModule } from './consultorio-routing.module';
import { ConsultorioContentComponent } from './consultorio-content/consultorio-content.component';
import { BusquedaPacienteComponent } from './busqueda-paciente/busqueda-paciente.component';
import { HistoriaPacienteComponent } from './historia-paciente/historia-paciente.component';
import { TratamientoPacienteComponent } from './tratamiento-paciente/tratamiento-paciente.component';
import { ListaTratamientoPacienteComponent } from './lista-tratamiento-paciente/lista-tratamiento-paciente.component';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GestionCitasComponent } from './gestion-citas/gestion-citas.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ListaHistoriasClinicasComponent } from './lista-historias-clinicas/lista-historias-clinicas.component';


//import { PacienteService } from '../core/paciente.service';

@NgModule({
  declarations: [
    ConsultorioContentComponent,
    RegistroPacienteComponent,
    BusquedaPacienteComponent,
    HistoriaPacienteComponent,
    TratamientoPacienteComponent,
    ListaTratamientoPacienteComponent,
    GestionCitasComponent,
    ListaHistoriasClinicasComponent,
  ],
  imports: [
    CommonModule,
    ConsultorioRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    BrowserModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgbModalModule,
  ],
  exports: [
  ],
  providers: [
  ]
})
export class ConsultorioModule { }
