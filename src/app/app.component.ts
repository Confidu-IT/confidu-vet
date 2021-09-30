import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {MenuController, Platform} from '@ionic/angular';
import {AuthService} from './services/auth.service';

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
    public translate: TranslateService,
    public menuCtrl: MenuController,
    private authService: AuthService
  ) {
    this.initializeApp();
    translate.addLangs(['en', 'de']);
    translate.setDefaultLang('de');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|de/) ? browserLang : 'de');
  }

  public onLogout(): void {
    this.authService.logOut()
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
