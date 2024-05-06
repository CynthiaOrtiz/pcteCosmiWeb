import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarCodesContentComponent } from './components/barCodes-content/barCodes-content.component';

/**
 * BarCodes module routing.
 *
 * @author components
 * @version 1.0
 * @since 1.0.0
 */
const routes: Routes = [
  {
    path: '', component: BarCodesContentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BarCodesRoutingModule { }
