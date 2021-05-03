import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CareCardDetailPageRoutingModule } from './care-card-detail-routing.module';

import { CareCardDetailPage } from './care-card-detail.page';
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
    CareCardDetailPageRoutingModule
  ],
  declarations: [CareCardDetailPage]
})
export class CareCardDetailPageModule {}
