import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {TranslateService} from '@ngx-translate/core';
import {CommonService} from '../../../services/common.service';
import {ModalController} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-care-card-list',
  templateUrl: './care-card-list.page.html',
  styleUrls: ['./care-card-list.page.scss'],
})
export class CareCardListPage {
  public isLoading: boolean;
  public iconPath = '../../../../assets/icons/care-card';
  public chevron = `${this.iconPath}/chevron-forward-outline.svg`;
  public paperclip = `${this.iconPath}/clip.svg`;
  public careCard: any;
  public listOpen = false;
  public imageZoom: boolean;
  public enlargedImg: string;
  public enlargedPdf: string;
  public isImg: boolean;
  public isPdf: boolean;
  public doUpload: string;
  public doManual: string;
  public logo = environment.logo;

  private subscription: Subscription;
  private readonly routeSub: Subscription;
  private user: any;
  private userId: any;
  private language: string;
  private petId: string;
  private key: string;
  private link: any;
  private label: string;
  private modalTitle: {
    doc: string;
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private afAuth: AngularFireAuth,
    public userAuth: CommonService,
    private translateService: TranslateService,
    private commonService: CommonService,
    private router: Router,
  ) {
    this.routeSub = this.activatedRoute.params
      .subscribe(params => {
        console.log('params', params);
        this.petId = params.petId;
        this.userId = params.userId;
        this.key = params.key;
        this.label = params.label;
      });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.language = this.commonService.language;
    this.translateService.setDefaultLang(this.language); // fallback
    this.translateService.use(this.translateService.getBrowserLang());
    this.translateService.get('CARE_CARD_LIST_PAGE')
      .subscribe(values => {
        this.modalTitle = {
          doc: values.ADD_DOC,
        };
        this.doUpload = values.UPLOAD;
        this.doManual = values.MANUAL;
      });


    this.subscription = this.userAuth.user$.pipe(
      tap(user => {
        if (!user) {
          this.router.navigateByUrl('/');
        }
        this.user = user;
      }),
      switchMap(user => {
        this.user = user;
        return this.commonService.getCareCardlistContent(this.key, this.user.za, this.petId, this.userId);
      })
    ). subscribe(data => {
      console.log('data', data);
      // console.log('this.tickets', this.tickets);
      if (data.currentList) {
        data.currentList = data.currentList.reverse();
      }
      if (data.terminatedList) {
        data.terminatedList = data.terminatedList.reverse();
      }
      this.careCard = data;
      this.link = this.careCard.link;
      this.isLoading = false;
    });
  }

  public onClickLink(list: string, key: string, venom: string, lvl3Id: string): void {
    const url = `pets/pet-care-card-detail/${key}/${list}/${venom}/${this.userId}/${this.petId}/${lvl3Id}/${this.label}`;
    this.router.navigateByUrl(url);
  }

  public openList() {
    this.listOpen = this.listOpen !== true;
  }

  public onOpenDocument(link: string) {
    console.log('link', link);
    this.commonService.getSecureLink(
      link,
      `user-docs`,
      this.petId,
      this.userId,
      this.user.za
    ).subscribe(data => {
      if (data) {
        const str = data.url;
        const x = str.search('pdf');
        if (x !== -1) {
          this.isPdf = true;
          this.enlargedPdf = data.url;
        } else {
          this.isImg = true;
          this.enlargedImg = data.url;
        }
        this.imageZoom = true;
      }
    });

  }

  public closeImage(): void {
    this.imageZoom = false;
    this.enlargedImg = null;
  }

  ionViewWillLeave() {
    this.imageZoom = false;
    this.enlargedImg = null;
    this.enlargedPdf = null;
    this.isImg = false;
    this.isPdf = false;
    this.listOpen = false;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.routeSub) {
      this.subscription.unsubscribe();
    }
  }
}
