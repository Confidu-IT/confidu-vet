import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {TranslateService} from '@ngx-translate/core';
import {MenuController, Platform} from '@ionic/angular';
import {CommonService} from './services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public iconPath = '../assets/icons/navi';

  constructor(
    private platform: Platform,
    private router: Router,
    private afAuth: AngularFireAuth,
    public translate: TranslateService,
    public menuCtrl: MenuController,
    private commonService: CommonService
  ) {
    this.initializeApp();
    translate.addLangs(['en', 'de']);
    translate.setDefaultLang('de');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|de/) ? browserLang : 'de');
  }

  public onLogout(): void {
    this.commonService.logOut()
      .then(() => {
        this.menuCtrl.close()
          .then(() => {
            this.router.navigateByUrl('/signin');
          });
      });
  }

  public toggleMenu(link: string) {
    this.menuCtrl.close().then(() => this.router.navigateByUrl(link));
  }

  initializeApp() {
    this.platform.ready().then(() => {

    });
  }
}
