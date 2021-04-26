import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PetCareCardPage } from './pet-care-card.page';

const routes: Routes = [
  {
    path: '',
    component: PetCareCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PetCareCardPageRoutingModule {}
