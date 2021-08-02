import {Component} from '@angular/core';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {FirebaseService} from '../services/firebase.service';
import {TranslateService} from '@ngx-translate/core';
import {CommonService} from '../services/common.service';
import {environment} from '../../environments/environment';
import {switchMap, tap} from 'rxjs/operators';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public user: any;
  public language: string;
  public pets: any[];
  public logo = environment.logo;
  public iconPath = '../../../../assets/icons';
  public chevron = `${this.iconPath}/care-card/chevron-forward-outline.svg`;
  public pillImg = `${this.iconPath}/home/med.svg`;
  public pageImg = `${this.iconPath}/home/request.svg`;
  public result: any;
  public isLoading: boolean;
  public pageEvent: PageEvent;
  public openRequestsTotal: number;
  public pageSizeOptions: number[] = [5, 10, 25, 100];
  public pageSize = 10;

  private subscription: Subscription;


  constructor(
    public userAuth: CommonService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private firebaseService: FirebaseService,
    private translateService: TranslateService,
    private commonService: CommonService,
  ) {
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.language = this.commonService.language;
    this.translateService.setDefaultLang(this.language); // fallback
    this.translateService.use(this.translateService.getBrowserLang());

    this.fetchData(this.pageSize, 1);
  }

  public getServerData(event): any {
    const page = event.pageIndex + 1;
    const limit = event.pageSize;
    return this.fetchData(limit, page);
  }

  public onClickRequest(id: string) {
    this.router.navigateByUrl(`releases/${id}`);
  }

  private fetchData(limit, page) {
    this.subscription = this.userAuth.user$.pipe(
      tap(user => user),
      switchMap(user => {
        if (!user) {
          this.router.navigateByUrl('/signin');
        }
        this.user = user;
        return this.commonService.getData(this.user.za, limit, page);
      })
    ).subscribe(data => {
      console.log('data', data);
      this.openRequestsTotal = data?.meta?.total;
      this.result = data;
      this.isLoading = false;
    });
  }

  ionViewWillLeave() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
