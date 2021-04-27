import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CareCardListPageRoutingModule } from './care-card-list-routing.module';

import { CareCardListPage } from './care-card-list.page';
import {TranslateModule} from '@ngx-translate/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {PdfViewerModule} from 'ng2-pdf-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    MatExpansionModule,
    PdfViewerModule,
    CareCardListPageRoutingModule
  ],
  declarations: [CareCardListPage]
})
export class CareCardListPageModule {}
