import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultorioContentComponent } from './modules/consultorio-content/consultorio-content.component';

const routes: Routes = [
  { path: '', redirectTo: '/consultorio', pathMatch: 'full' },
  {
    path: 'consultorio',
    loadChildren: () => import('./modules/consultorio.module').then(m => m.ConsultorioModule)
  },
  { path: 'hom', component: ConsultorioContentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
