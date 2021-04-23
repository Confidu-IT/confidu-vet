import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {AuthService} from './signin/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {MenuController, Platform} from '@ionic/angular';

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
    private authService: AuthService,
    public translate: TranslateService,
    public menuCtrl: MenuController
  ) {
    this.initializeApp();
    translate.addLangs(['en', 'de']);
    translate.setDefaultLang('de');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|de/) ? browserLang : 'de');
  }

  public toggleMenu(link: string) {
    this.menuCtrl.close().then(() => {
      return this.router.navigateByUrl(link);
    });
  }

  public onLogout(): void {
    this.menuCtrl.close().then(() => {
      this.authService.afAuth.signOut();
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {

    });
  }
}
