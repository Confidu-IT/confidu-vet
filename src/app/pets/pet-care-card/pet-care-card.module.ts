import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PetCareCardPageRoutingModule } from './pet-care-card-routing.module';

import { PetCareCardPage } from './pet-care-card.page';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    PetCareCardPageRoutingModule
  ],
  declarations: [PetCareCardPage]
})
export class PetCareCardPageModule {}
