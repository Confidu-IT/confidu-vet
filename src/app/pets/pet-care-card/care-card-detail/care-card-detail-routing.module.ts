import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CareCardDetailPage } from './care-card-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CareCardDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CareCardDetailPageRoutingModule {}
