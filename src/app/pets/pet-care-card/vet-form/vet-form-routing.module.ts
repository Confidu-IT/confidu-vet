import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VetFormPage } from './vet-form.page';

const routes: Routes = [
  {
    path: '',
    component: VetFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VetFormPageRoutingModule {}
