import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CommonService} from '../../services/common.service';
import {ActivatedRoute, Router} from '@angular/router';
import {of, Subscription} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-pet-care-card',
  templateUrl: './pet-care-card.page.html',
  styleUrls: ['./pet-care-card.page.scss'],
})
export class PetCareCardPage {
  public isLoading = false;
  public pet: any;
  public panels: any;
  public language: string;
  public user: any;
  public baseDataImg: string;
  public iconPath = '../../../../assets/icons/care-card';
  public chevron = `${this.iconPath}/chevron-forward-outline.svg`;

  private subscription: Subscription;
  private readonly routeSub: Subscription;
  private params: any;

  constructor(
    private translateService: TranslateService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    public userAuth: CommonService,
    private afAuth: AngularFireAuth,
    private router: Router,
  ) {
    this.routeSub = this.activatedRoute.params
      .subscribe(params => {
        console.log('params', params);
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
      switchMap( user => {
        if(!user) {
          this.router.navigateByUrl('/');
        }
        this.user = user;
        try {
          return this.commonService.getCareCardContent(this.params.petId, this.params.userId, this.user.za);
        } catch (e) {
          this.router.navigateByUrl('/');
          return of(e);
        }
      })
    ).subscribe(content => {
      console.log('content', content);
      this.panels = content.data;
      this.isLoading = false;
    });
  }

  public onClickLink(el: any): void {
    console.log(el);
    this.router.navigateByUrl(`pets/pet-care-card/${this.params.userId}/${this.params.petId}/${el.label}/${el.key}`);
  }

  public goToForm(): void {
    const url = `pets/vet-form/${this.params.userId}/${this.params.petId}/${this.params.appointmentId}`;
    this.router.navigateByUrl(url);
  }

}
