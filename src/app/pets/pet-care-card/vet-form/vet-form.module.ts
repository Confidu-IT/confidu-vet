import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VetFormPageRoutingModule } from './vet-form-routing.module';

import { VetFormPage } from './vet-form.page';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {TranslateModule} from '@ngx-translate/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatExpansionModule} from '@angular/material/expansion';
import {TruncatePipe} from '../../../pipes/truncate.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    MatExpansionModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    VetFormPageRoutingModule
  ],
  declarations: [
    VetFormPage,
    TruncatePipe,
  ],
  exports: [
    TruncatePipe
  ]
})
export class VetFormPageModule {}
