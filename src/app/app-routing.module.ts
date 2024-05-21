import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultorioContentComponent } from './modules/consultorio-content/consultorio-content.component';
import { BusquedaPacienteComponent } from './modules/busqueda-paciente/busqueda-paciente.component';
import { TratamientoPacienteComponent } from './modules/tratamiento-paciente/tratamiento-paciente.component';
import { HistoriaPacienteComponent } from './modules/historia-paciente/historia-paciente.component';
import { ListaTratamientoPacienteComponent } from './modules/lista-tratamiento-paciente/lista-tratamiento-paciente.component';
import { RegistroPacienteComponent } from './modules/registro-paciente/registro-paciente.component';


const routes: Routes = [
  { path: '', redirectTo: '/consultorio', pathMatch: 'full' },
  {
    path: 'consultorio',
    loadChildren: () => import('./modules/consultorio.module').then(m => m.ConsultorioModule)
  },
  { path: 'hom', component: ConsultorioContentComponent },
  { path: 'busqueda-paciente', component: BusquedaPacienteComponent },
  { path: 'tratamiento-paciente/:id', component: TratamientoPacienteComponent },
  { path: 'historia-clinica/:id', component: HistoriaPacienteComponent },
  { path: 'lista-tratamientos/:id', component: ListaTratamientoPacienteComponent },
  { path: 'registro-paciente', component: RegistroPacienteComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
