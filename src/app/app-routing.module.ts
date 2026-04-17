import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultorioContentComponent } from './modules/consultorio-content/consultorio-content.component';
import { BusquedaPacienteComponent } from './modules/busqueda-paciente/busqueda-paciente.component';
import { TratamientoPacienteComponent } from './modules/tratamiento-paciente/tratamiento-paciente.component';
import { HistoriaPacienteComponent } from './modules/historia-paciente/historia-paciente.component';
import { ListaTratamientoPacienteComponent } from './modules/lista-tratamiento-paciente/lista-tratamiento-paciente.component';
import { RegistroPacienteComponent } from './modules/registro-paciente/registro-paciente.component';
import { GestionCitasComponent } from './modules/gestion-citas/gestion-citas.component';
import { ListaHistoriasClinicasComponent } from './modules/lista-historias-clinicas/lista-historias-clinicas.component';
import { TipoTratamientoComponent } from './modules/tipo-tratamiento/tipo-tratamiento.component';
import { FacturacionComponent } from './modules/facturacion/facturacion.component';


const routes: Routes = [
  { path: '', redirectTo: '/consultorio', pathMatch: 'full' },
  {
    path: 'consultorio',
    loadChildren: () => import('./modules/consultorio.module').then(m => m.ConsultorioModule)
  },
  { path: 'hom', component: ConsultorioContentComponent },
  { path: 'busqueda-paciente', component: BusquedaPacienteComponent },
  { path: 'tratamiento-paciente/:id', component: TratamientoPacienteComponent },
  { path: 'historias-clinicas/:id', component: ListaHistoriasClinicasComponent },
  { path: 'historia-clinica/:idHistoria/:idPaciente', component: HistoriaPacienteComponent },
  { path: 'lista-tratamientos/:id', component: ListaTratamientoPacienteComponent },
  { path: 'registro-paciente', component: RegistroPacienteComponent },
  { path: 'agendar-citas', component: GestionCitasComponent },
  { path: 'catalogos', component: TipoTratamientoComponent },
  { path: 'facturacion', component: FacturacionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
