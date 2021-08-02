import {Component} from '@angular/core';
import {CommonService} from '../services/common.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {FirebaseService} from '../services/firebase.service';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-releases',
  templateUrl: './releases.page.html',
  styleUrls: ['./releases.page.scss'],
})
export class ReleasesPage {
  public user: any;
  public language: string;
  public isLoading: boolean;
  public logo = environment.logo;
  public headerImage = '../../../../assets/icons/stethoskop.svg';
  public result: any;

  private subscription: Subscription;
  private readonly routeSub: Subscription;
  private params: any;

  constructor(
    public userAuth: CommonService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private firebaseService: FirebaseService,
    private translateService: TranslateService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute
  ) {
    this.routeSub = this.activatedRoute.params
      .subscribe(params => {
        this.params = params;
      });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.language = this.commonService.language;
    this.translateService.setDefaultLang(this.language); // fallback
    this.translateService.use(this.translateService.getBrowserLang());

    this.subscription = this.userAuth.user$.pipe(
      tap(user => user),
      switchMap(user => {
        if (!user) {
          return this.router.navigateByUrl('/signin');
        }
        this.user = user;
        return this.commonService.getReleaseRequest(this.user.za, this.params.id);
      })
    ).subscribe(res => {
      if (!res) {
        return this.router.navigateByUrl('/');
      }
      this.result = res.data;
      console.log('this.result', this.result);
      this.isLoading = false;
      console.log('this.isLoading', this.isLoading);
    });
  }

  public onRelease(): void {
  }

  public onDeny(): void {
  }

  ionViewWillLeave() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
