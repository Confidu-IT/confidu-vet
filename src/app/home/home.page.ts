import { Component } from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../signin/auth.service';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {FirebaseService} from '../services/firebase.service';
import {TranslateService} from '@ngx-translate/core';
import {CommonService} from '../services/common.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public user: any;
  public language: string;

  private subscription: Subscription;

  constructor(
    public userAuth: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private firebaseService: FirebaseService,
    private translateService: TranslateService,
    private commonService: CommonService,
  ) {}

  ionViewWillEnter() {
    this.language = this.commonService.language;
    this.translateService.setDefaultLang(this.language); // fallback
    this.translateService.use(this.translateService.getBrowserLang());

    this.subscription = this.userAuth.user$
      .subscribe(user => {
        console.log('user', user);
        if(!user) {
          this.router.navigateByUrl('/signin');
        }
      });
  }

}
