import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CareCardListPage } from './care-card-list.page';

const routes: Routes = [
  {
    path: '',
    component: CareCardListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CareCardListPageRoutingModule {}
