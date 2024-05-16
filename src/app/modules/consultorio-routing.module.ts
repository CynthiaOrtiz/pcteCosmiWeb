import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultorioContentComponent } from './consultorio-content/consultorio-content.component';

/**
 * consultorio module routing.
 *
 * @author components
 * @version 1.0
 * @since 1.0.0
 */
const routes: Routes = [
  {
    path: '', component: ConsultorioContentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultorioRoutingModule { }
