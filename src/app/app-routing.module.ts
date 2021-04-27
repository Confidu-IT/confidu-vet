import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'signin',
    loadChildren: () => import('./signin/signin.module').then( m => m.SigninPageModule)
  },
  {
    path: 'pet-care-card/:userId/:petId',
    loadChildren: () => import('./pets/pet-care-card/pet-care-card.module').then( m => m.PetCareCardPageModule)
  },
  {
    path: 'pets/pet-care-card/:userId/:petId/:label/:key',
    loadChildren: () => import('./pets/pet-care-card/care-card-list/care-card-list.module').then( m => m.CareCardListPageModule)
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
