import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CommonService} from '../../services/common.service';
import {ActivatedRoute, Router} from '@angular/router';
import {of, Subscription} from 'rxjs';
import {AuthService} from '../../signin/auth.service';
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

  private subscription: Subscription;
  private readonly routeSub: Subscription;
  private params: any;

  constructor(
    private translateService: TranslateService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    public userAuth: AuthService,
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
          // delete this
          const pet = 'QLVAJEcL46ffwAAs2p2g';
          const userId = 'b3eae868d1554bc1b984f98bec63c667';
          const token = this.user.za;
          return this.commonService.getCareCardContent(pet, userId, token);

          // return this.commonService.getCareCardContent(this.params.petId, this.params.userId, this.user.za);
        } catch (e) {
          this.router.navigateByUrl('/');
          return of(e);
        }
      })
    ).subscribe(data => {
      console.log('data', data);
    });
  }

}
