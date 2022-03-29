import {Component} from '@angular/core';
import {CommonService} from '../services/common.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {FirebaseService} from '../services/firebase.service';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {DomSanitizer} from '@angular/platform-browser';

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
  public clip = '../../../../assets/icons/care-card/clip.svg';
  public result: any;

  public imageZoom: boolean;
  public enlargedImg: string;
  public enlargedPdf: any;
  public isImg: boolean;
  public isPdf: boolean;

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
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer
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
    });
  }

  public onOpenDocument(link: string) {
    console.log('link', link);
    this.commonService.getSecureLink(
      link,
      `user-docs`,
      this.result.petId,
      this.result.uid,
      this.user.za
    ).subscribe(data => {
      if (data) {
        const str = data.url;
        const x = str.search('pdf');
        if (x !== -1) {
          this.isPdf = true;
          this.enlargedPdf = this.sanitizer.bypassSecurityTrustResourceUrl(data.url);
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

  public onApprove(): void {
    this.commonService.sendApprovalOrDenial(this.user.za, this.params.id, 'complete', this.result)
      .subscribe(data => {
        if (data) {
          this.router.navigateByUrl('/');
        }
      });
  }

  public toForm() {
    this.router.navigateByUrl(`pets/vet-form/photo/${this.result.uid}/${this.result.petId}/${this.result.orderId}`);
  }

  public toCareCard(): void {
    this.router.navigateByUrl(`pet-care-card/release/${this.result.uid}/${this.result.petId}/${this.params.id}`);
  }

  public onDeny(): void {
    this.commonService.sendApprovalOrDenial(this.user.za, this.params.id, 'cancel', this.result)
      .subscribe(data => {
        if (data) {
          this.router.navigateByUrl('/');
        }
      });
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
