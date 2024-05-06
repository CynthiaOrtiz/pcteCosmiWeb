import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegistroPacienteComponent } from './components/registro-paciente/registro-paciente.component';
import { ConsultorioRoutingModule } from './consultorio-routing.module';
import { ConsultorioContentComponent } from './components/consultorio-content/consultorio-content.component';

@NgModule({
  declarations: [
    ConsultorioContentComponent,
    RegistroPacienteComponent
  ],
  imports: [
    CommonModule,
    ConsultorioRoutingModule,
    FormsModule
  ],
  exports: [
  ],
  providers: [
  ]
})
export class ConsultorioModule { }
