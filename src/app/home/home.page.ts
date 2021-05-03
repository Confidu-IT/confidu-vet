import { Component } from '@angular/core';
import {Subscription} from 'rxjs';
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
  public pets: any[];

  private subscription: Subscription;

  constructor(
    public userAuth: CommonService,
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
        this.pets = [];
        this.pets.push(
          {
            petId: 'cbCiQm9qzPl7ph6IDDG7',
            userId: '7ee4c83a58544c12982848b09e867f08',
            appointmentId: '583123790'
          }
          );
      });
  }

  public onClickLink(userId: string, petId: string, appointmentId: string): void {
    this.router.navigateByUrl(`/pet-care-card/${userId}/${petId}/${appointmentId}`);
  }

  ionViewWillLeave() {
    this.pets = undefined;
  }

}
