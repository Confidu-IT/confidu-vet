import { Component } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../../../services/common.service';
import {TranslateService} from '@ngx-translate/core';
import {FirebaseService} from '../../../services/firebase.service';
import {map, startWith, switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-vet-form',
  templateUrl: './vet-form.page.html',
  styleUrls: ['./vet-form.page.scss'],
})
export class VetFormPage {
  public headerImage = '../../../../assets/icons/stethoskop.svg';
  public medForm: FormGroup;
  public meds = [];
  public filteredMeds: Observable<any[]>;
  public medications: any;
  public selectedMedication: any;

  public diagnosisForm: FormGroup;
  public diags = [];
  public filteredDiagnosis: Observable<any[]>;
  public diagnosis: any;
  public selectedDiagnosis: any;

  // public therapyForm: FormGroup;
  // public theraps = [];
  // public filteredTherapy: Observable<any[]>;
  // public therapy: any;

  public therapies: any;
  public urgencies: any;
  public selectedTherapy: any;
  public selectedUrgency: any;

  public findingsForm: FormGroup;
  public finds = [];
  public filteredFinding: Observable<any[]>;
  public findings: any;
  public selectedFinding: any;

  public user: any;
  public isLoading: boolean;
  public result: any;
  public pet: any;
  public vet: any;

  public ownerText: string;
  public petWeight: string | number;
  public medicationText: string;
  public monitoringText: string;
  public managementText: string;
  public feedingText: string;
  public longFoodDesc = false;

  public food: any;
  public selectedFood: any;

  public categories: any;
  public products: any;
  public selectedProduct: any;

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
    private translateService: TranslateService
  ) {
    this.routeSub = this.activatedRoute.params
      .subscribe(params => {
        this.params = params;

        this.medForm = new FormGroup({
          med: new FormControl(null, {
            updateOn: 'change'
          })
        });
        this.diagnosisForm = new FormGroup({
          diagnosis: new FormControl(null, {
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
        this.user = user;
      }),
      switchMap(() => this.commonService.getVetFormContent(this.params, this.user))
    ).subscribe(result => {
      console.log('result', result);
      this.pet = result?.data?.pet;
      this.food = result?.data?.diet?.data?.list;
      this.therapies = result?.data?.teleTherapy?.data;
      this.urgencies = result?.data?.urgency?.data;

      this.fetchMedications();
      this.fetchDiagnosis();
      this.isLoading = false;
    });

  }

  public onSaveDocument(): void {}

  public onPickFood(event): void {
    this.selectedFood = event.value;
  }

  public onPickUrgeny(event): void {
    this.selectedUrgency = event.value;
  }

  public onPickTherapy(event): void {
    this.selectedTherapy = event.value;
  }

  public toggleFoodDescription(): void {
    this.longFoodDesc = this.longFoodDesc === false;
    console.log('this.longFoodDesc', this.longFoodDesc);
  }

  public onAddElement(type: string): void {
    if (type === 'med') {
      this.meds.push(this.selectedMedication);
      this.selectedMedication = undefined;
      this.medForm.patchValue({ med: '' });
      console.log('meds', this.meds);
    }

    if (type === 'diag') {
      this.diags.push(this.selectedDiagnosis);
      this.selectedDiagnosis = undefined;
      this.diagnosisForm.patchValue({ diagnosis: '' });
      console.log('diags', this.diags);
    }

  }

  public displayLabel(el?: any): any {
    return el ? el.name : undefined;
  }

  public onValueChange(event: any, list: string): void {
    if (!event.isUserInput) {
      return;
    }
    if (list === 'medication') {
      this.selectedMedication = event.source.value;
    }
    if (list === 'diagnosis') {
      this.selectedDiagnosis = event.source.value;
    }
    if (list === 'therapy') {
      this.selectedTherapy = event.source.value;
    }
    if (list === 'findings') {
      this.selectedFinding = event.source.value;
    }
  }

  public removeEl(el: string, type: string) {

    if (type === 'med') {
      this.meds = this.meds.filter((value) => value !== el);
    }
    if (type === 'diag') {
      this.diags = this.diags.filter((value) => value !== el);
    }
  }

  private _filter(name: string) {
    const filterValue = name.toLowerCase();
    return this.medications.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private fetchMedications(): void {
    this.firebaseService.getScanDB(this.language, 'medication', this.pet.species.value)
      .subscribe(med => {
        this.medications = med;
        if (this.medications?.length > 0) {
          this.filteredMeds = this.medForm.get('med').valueChanges
            .pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : value.name),
              map(name => name ? this._filter(name) : this.medications.slice())
            );
        }
      });
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
              map(name => name ? this._filter(name) : this.diagnosis.slice())
            );
        }
      });
  }




  ionViewWillLeave() {
    this.meds = undefined;
    this.diags = undefined;

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

}
