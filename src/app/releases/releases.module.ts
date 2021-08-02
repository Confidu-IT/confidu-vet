import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ReleasesPageRoutingModule} from './releases-routing.module';

import {ReleasesPage} from './releases.page';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReleasesPageRoutingModule
  ],
  declarations: [ReleasesPage]
})
export class ReleasesPageModule {
}
