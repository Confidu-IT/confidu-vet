import {Component} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../../../services/common.service';
import {TranslateService} from '@ngx-translate/core';
import {FirebaseService} from '../../../services/firebase.service';
import {map, startWith, switchMap, tap} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-vet-form',
  templateUrl: './vet-form.page.html',
  styleUrls: ['./vet-form.page.scss'],
})
export class VetFormPage {
  public headerImage = '../../../../assets/icons/stethoskop.svg';
  public logo = environment.logo;
  public iconPath = '../../../../assets/icons/care-card';
  public paperclip = `${this.iconPath}/clip.svg`;
  public successImg = `${this.iconPath}/form_success.svg`;
  public showEndState = false;

  public diagnosisForm: FormGroup;
  public diags = [];
  public filteredDiagnosis: Observable<any[]>;
  public diagnosis: any;
  public selectedDiagnosis: any;

  public therapies: any;
  public urgencies: any;
  public selectedTherapy: any;
  public selectedUrgency: any;

  public user: any;
  public isLoading: boolean;
  public result: any;
  public pet: any;
  public vet: any;
  public owner: any;
  public longAnnotations = false;

  public ownerText: string;
  public petWeight: string | number;
  public medicationText: string;
  public ticketText: string;
  public monitoringText: string;
  public managementText: string;
  public feedingText: string;
  public longFoodDesc = false;
  public longActivityDesc = false;

  public food: any;
  public selectedFood: any;
  public foodText: any;

  public activities: any;
  public selectedActivity: any;
  public activityText: any;

  public productsForm: FormGroup;
  public categories: any;
  public products: any;
  public prods = [];
  public cates = [];
  public selectedProduct: any;
  public selectedCategory: any;
  public filteredProduct: Observable<any[]>;
  public filteredCategory: Observable<any[]>;

  public answer: any;

  public imageZoom: boolean;
  public enlargedImg: string;
  public enlargedPdf: any;
  public isImg: boolean;
  public isPdf: boolean;

  public disableButton = false;

  private subscription: Subscription;
  private readonly routeSub: Subscription;
  private params: any;
  private language: string;
  private vetVisit: string;

  constructor(
    private router: Router,
    private userAuth: CommonService,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private firebaseService: FirebaseService,
    private translateService: TranslateService,
    private sanitizer: DomSanitizer
  ) {
    this.routeSub = this.activatedRoute.params
      .subscribe(params => {
        this.params = params;
        console.log('params', this.params);

        this.diagnosisForm = new FormGroup({
          diagnosis: new FormControl(null, {
            updateOn: 'change'
          })
        });

        this.productsForm = new FormGroup({
          category: new FormControl(null, {
            updateOn: 'change'
          }),
          product: new FormControl(null, {
            updateOn: 'change'
          })
        });
      });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.language = this.commonService.language;
    this.translateService.setDefaultLang(this.language); // fallback
    this.translateService.use(this.translateService.getBrowserLang());
    this.translateService.get('PRESCRIPTION_RESULT_PAGE')
      .subscribe(values => {
        this.vetVisit = values.VET_VISIT;
      });

    this.subscription = this.userAuth.user$.pipe(
      tap(user => {
        if (!user) {
          return this.router.navigateByUrl('/');
        }
        return this.user = user;
      }),
      switchMap(user => {
        if (this.params.appointmentId) {
          return this.commonService.getVetFormContent(this.params, this.user);
        } else if (this.params.orderId) {
          return this.commonService.getVetFormPhotoContent(
            this.params.petId, this.params.userId, this.params.orderId, user.za
          );
        }
      })
    ).subscribe(result => {
      console.log('result', result);
      this.pet = result?.data?.pet;
      this.vet = result?.data?.vet;
      this.owner = result?.data?.user;
      this.food = result?.data?.diet?.data?.list;
      this.activities = result?.data?.activity?.data?.list;
      this.therapies = result?.data?.teleTherapy?.data;
      this.urgencies = result?.data?.urgency?.data;
      this.answer = {
        diagnosis: null,
        urgency: null,
        therapy: null,
        ownerText: null,
        petWeight: null,
        products: null,
        medicationText: null,
        ticketText: null,
        diet: {
          type: null,
          text: null
        },
        activity: {
          type: null,
          text: null
        },
        monitoringText: null,
        managementText: null
      };

      this.fetchDiagnosis();
      this.fetchCategories();
      this.isLoading = false;
    });

  }

  public onSaveDocument(): void {
    if (this.diags?.length > 0) {
      this.answer.diagnosis = this.diags;
    }
    if (this.prods?.length > 0) {
      this.answer.products = this.prods;
    }
    if (this.selectedFood) {
      this.answer.diet.type = this.selectedFood;
      if (this.foodText) {
        this.answer.diet.text = this.foodText;
      }
    }
    if (this.selectedActivity) {
      this.answer.activity.type = this.selectedActivity;
      if (this.activityText) {
        this.answer.activity.text = this.activityText;
      }
    }
    if (this.selectedUrgency) {
      this.answer.urgency = this.selectedUrgency;
    }
    if (this.selectedTherapy) {
      this.answer.therapy = this.selectedTherapy;
    }
    if (this.ownerText) {
      this.answer.ownerText = this.ownerText;
    }
    if (this.medicationText) {
      this.answer.medicationText = this.medicationText;
    }
    if (this.ticketText) {
      this.answer.ticketText = this.ticketText;
    }
    if (this.monitoringText) {
      this.answer.monitoringText = this.monitoringText;
    }
    if (this.managementText) {
      this.answer.managementText = this.managementText;
    }
    if (this.petWeight) {
      this.answer.petWeight = this.petWeight.toString();
    }

    console.log('this.answer', this.answer);

    if (this.params.appointmentId) {
      this.disableButton = true;
      this.commonService.submitForm(
        this.params,
        this.user,
        this.owner.appointmentID,
        this.answer
      ).subscribe(response => {
        this.showEndState = true;
        this.disableButton = true;
        this.answer = {
          diagnosis: null,
          urgency: null,
          therapy: null,
          ownerText: null,
          petWeight: null,
          products: null,
          medicationText: null,
          ticketText: null,
          diet: {
            type: null,
            text: null
          },
          activity: {
            type: null,
            text: null
          },
          monitoringText: null,
          managementText: null
        };
      });
    } else if (this.params.orderId) {
      this.disableButton = true;
      this.commonService.submitPhotoForm(
        this.params,
        this.user,
        this.answer
      ).subscribe(response => {
        this.showEndState = true;
        this.disableButton = false;
        this.answer = {
          diagnosis: null,
          urgency: null,
          therapy: null,
          ownerText: null,
          petWeight: null,
          products: null,
          medicationText: null,
          ticketText: null,
          diet: {
            type: null,
            text: null
          },
          activity: {
            type: null,
            text: null
          },
          monitoringText: null,
          managementText: null
        };
      });
    }


  }

  public onOpenDocument(link: string) {
    console.log('link', link);
    this.commonService.getSecureLink(
      link,
      `user-docs`,
      this.params.petId,
      this.params.userId,
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

  public onPickFood(event): void {
    this.selectedFood = event.value;
  }

  public onPickActivity(event): void {
    this.selectedActivity = event.value;
  }

  public onPickUrgeny(event): void {
    this.selectedUrgency = event.value;
  }

  public onPickCategory(event): void {
    this.selectedCategory = event.value;
    this.fetchProducts(event.value.categoryKey);
  }

  public onPickTherapy(event): void {
    this.selectedTherapy = event.value;
  }

  public toggleFoodDescription(): void {
    this.longFoodDesc = this.longFoodDesc === false;
  }

  public toggleActivityDescription(): void {
    this.longActivityDesc = this.longActivityDesc === false;
  }

  public toggleAnnotations(): void {
    this.longActivityDesc = this.longActivityDesc === false;
  }

  public onAddElement(type: string): void {
    if (type === 'diag') {
      this.diags.push(this.selectedDiagnosis);
      this.selectedDiagnosis = undefined;
      this.diagnosisForm.patchValue({diagnosis: ''});
    }

    if (type === 'product') {
      this.prods.push(this.selectedProduct);
      this.selectedProduct = undefined;
      this.productsForm.patchValue({product: ''});
    }

  }

  public displayLabelDiag(el?: any): any {
    return el ? el.name : undefined;
  }

  public displayLabelCat(el?: any): any {
    return el ? el.categoryName : undefined;
  }

  public onValueChange(event: any, list: string): void {
    if (list === 'diagnosis' && !event.isUserInput) {
      return;
    }

    if (list === 'diagnosis') {
      this.selectedDiagnosis = event.source.value;
    }
    if (list === 'category') {
      this.selectedCategory = event.source.value;
    }
    if (list === 'product') {
      this.selectedProduct = event.value;
    }
  }

  public removeEl(el: string, type: string) {
    if (type === 'diag') {
      this.diags = this.diags.filter((value) => value !== el);
    }

    if (type === 'product') {
      this.prods = this.prods.filter((value) => value !== el);
    }
  }

  private filterDiag(name: string) {
    const filterValue = name.toLowerCase();
    return this.diagnosis.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private fetchDiagnosis(): void {
    this.firebaseService.getScanDB(this.language, 'diagnosis', this.pet.species.value)
      .subscribe(data => {
        this.diagnosis = data;
        if (this.diagnosis?.length > 0) {
          this.filteredDiagnosis = this.diagnosisForm.get('diagnosis').valueChanges
            .pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : value.name),
              map(name => name ? this.filterDiag(name) : this.diagnosis.slice())
            );
        }
      });
  }

  private fetchCategories(): void {
    this.firebaseService.getCategories(this.language, this.pet.species.value)
      .subscribe(data => {
        this.categories = data;
      });
  }

  private fetchProducts(key: string): void {
    this.firebaseService.getProductsToCategory(this.language, this.pet.species.value, key)
      .subscribe(data => {
        this.products = data;
      });
  }

  ionViewWillLeave() {
    this.showEndState = false;
    this.diags = undefined;
    this.prods = [];
    this.cates = [];

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

}
