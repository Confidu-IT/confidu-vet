import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CommonService} from '../../services/common.service';
import {ActivatedRoute, Router} from '@angular/router';
import {of, Subscription} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {switchMap, tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

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
  public isCastrated: boolean;
  public castrationLabel: string;
  public hasId: boolean;
  public noId: string;
  public noData: string;
  public breed: any;
  public logo = environment.logo;

  public params: any;
  private subscription: Subscription;
  private readonly routeSub: Subscription;


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
        this.params = params;
        console.log('this.params', this.params);
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
      this.pet = content.pet;
      const species = this.pet.pet.species.value === 'dog' ? 'basedata_dog' : 'basedata_cat';
      // eslint-disable-next-line no-eval
      this.isCastrated = eval(this.pet.pet.castration.value);
      this.hasId = this.pet.pet.petIdent;
      this.breed = this.language === 'de' ? this.pet.pet.breed.data.name_de : this.pet.pet.breed.data.name_en;
      this.baseDataImg = `${this.iconPath}/${species}.svg`;
      this.isLoading = false;
    });
  }

  public onClickLink(el: any): void {
    console.log(el);
    this.router.navigateByUrl(`pets/pet-care-card/${this.params.userId}/${this.params.petId}/${el.label}/${el.key}`);
  }

  public goToForm(): void {
    this.router.navigateByUrl(`pets/vet-form/${this.params.userId}/${this.params.petId}/${this.params.appointmentId}`);
  }

  public goToRelease(): void {
    const url = `releases/${this.params.releaseId}`;
    this.router.navigateByUrl(url);
  }

}
