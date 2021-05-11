import { Component } from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../../services/common.service';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../../../../environments/environment';
import {switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-care-card-detail',
  templateUrl: './care-card-detail.page.html',
  styleUrls: ['./care-card-detail.page.scss'],
})
export class CareCardDetailPage {
  public isLoading: boolean;
  public result: any;
  public iconPath = '../../../../assets/icons/care-card';
  public chevron = `${this.iconPath}/chevron-forward-outline.svg`;
  public paperclip = `${this.iconPath}/clip.svg`;
  public eyeIcon = `${this.iconPath}/eye.svg`;
  public cartCheckIcon = `${this.iconPath}/product-check.svg`;
  public medications: any[];
  public docDownloadLink: string;
  public pdfZoom: boolean;
  public listOpenVaccines = [];
  public listOpenMedication = [];
  public listOpenMedicalTests = [];
  public explSliderOpen = false;
  public logo = environment.logo;

  public slideOptions = {
    initialSlide: 0,
    slidesPerView: 2,
    spaceBetween: 5
  };

  // change this
  public pillImg = `${this.iconPath}/pill.svg`;

  private subscription: Subscription;
  private readonly routeSub: Subscription;
  private params: any;
  private language: string;
  private user: any;
  private baseUrL: string;
  private modalTitle: {
    med: string;
    doc: string;
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    public userAuth: CommonService,
    private translateService: TranslateService,
    private commonService: CommonService,
  ) {
    this.routeSub = this.activatedRoute.params
      .subscribe(params => {
        this.params = params;
      });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.baseUrL = environment.baseUrl;
    this.language = this.commonService.language;
    this.translateService.setDefaultLang(this.language); // fallback
    this.translateService.use(this.translateService.getBrowserLang());
    this.translateService.get('DISEASE_PAGE')
      .subscribe(values => {
        this.modalTitle = {
          med: values.MED.ADD,
          doc: values.DOC.ADD
        };
      });
    this.subscription = this.userAuth.user$.pipe(
      tap(user => {
        if (!user) {
          this.router.navigateByUrl('/');
        }
        this.user = user;
      }),
      switchMap(() => this.commonService.getCareCardDetailContent(this.params, this.user))
    ).subscribe((data: any) => {
      if (data) {
        console.log('data', data);
        this.result = data;
        this.createChevrons();
      } else {
        this.router.navigateByUrl('/');
      }
      this.isLoading = false;
    });
  }

  private createChevrons() {
    if (this.result?.vaccines?.param) {
      this.listOpenVaccines = [];
      const arr = this.result?.vaccines?.param;
      arr.map((value, index) => {
        if (value.expandable) {
          if (value.body || value.list) {
            const obj = {
              val: false
            };
            this.listOpenVaccines.push(obj);
          }
        }
      });
    }
    if (this.result?.medication?.interaction?.param) {
      this.listOpenMedication = [];
      const arr = this.result?.medication?.interaction?.param;
      arr.map((value, index) => {
        if (value.expandable) {
          if (value.body || value.list) {
            const obj = {
              val: false
            };
            this.listOpenMedication.push(obj);
          }
        }
      });
    }
    if (this.result?.medicaltests?.param) {
      this.listOpenMedication = [];
      const arr = this.result?.medicaltests?.param;
      arr.map((value, index) => {
        if (value.expandable) {
          if (value.body || value.list) {
            const obj = {
              val: false
            };
            this.listOpenMedicalTests.push(obj);
          }
        }
      });
    }
  }

  public onZoomDocument(path: string): void {
    this.commonService.getSecureLink(
      path,
      `user-docs`,
      this.params.petId,
      this.user.uid,
      this.user.za
    ).subscribe(link => {
      this.docDownloadLink = link.url;
      console.log('docDownloadLink', this.docDownloadLink);
      this.pdfZoom = true;
    });
  }

  public unZoom(): void {
    this.pdfZoom = false;
  }

  public openVaccinesIngredientsList(index) {
    this.listOpenVaccines[index].val = this.listOpenVaccines[index].val === false;
  }

  public openMedicationIngredientsList(index) {
    this.listOpenMedication[index].val = this.listOpenMedication[index].val === false;
  }

  public openMedicalTestsList(index) {
    this.listOpenMedicalTests[index].val = this.listOpenMedicalTests[index].val === false;
  }

  public openExplSlider() {
    console.log('click slider', this.explSliderOpen);
    this.explSliderOpen = this.explSliderOpen === false;
  }


  ionViewWillLeave() {
    this.listOpenVaccines = [];
    this.listOpenMedication = [];
    this.listOpenMedicalTests = [];
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.routeSub) {
      this.subscription.unsubscribe();
    }
  }

}
