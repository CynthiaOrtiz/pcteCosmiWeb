import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegistroPacienteComponent } from './components/registro-paciente/registro-paciente.component';
import { BarCodesRoutingModule } from './consultorio-routing.module';
@NgModule({
  declarations: [
    RegistroPacienteComponent
  ],
  imports: [
    CommonModule,
    BarCodesRoutingModule,
    FormsModule
  ],
  exports: [
  ],
  providers: [
  ]
})
export class ConsultorioModule { }
