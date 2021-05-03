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

  public therapyForm: FormGroup;
  public theraps = [];
  public filteredTherapy: Observable<any[]>;
  public therapy: any;
  public selectedTherapy: any;

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

  private subscription: Subscription;
  private readonly routeSub: Subscription;
  private params: any;
  private language: string;
  private petId: string;
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
        this.therapyForm = new FormGroup({
          therapy: new FormControl(null, {
            updateOn: 'change'
          })
        });
        this.findingsForm = new FormGroup({
          finding: new FormControl(null, {
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
    ).subscribe(data => {
      console.log('data', data);


      //change this

      this.pet = {
        pet: {
          species: {
            value: 'dog'
          }
        }
      };
      this.fetchMedications();
      this.fetchDiagnosis();
      this.isLoading = false;
    });

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

    if (type === 'therapy') {
      this.theraps.push(this.selectedTherapy);
      this.selectedTherapy = undefined;
      this.therapyForm.patchValue({ therapy: '' });
      console.log('theraps', this.theraps);
    }

    if (type === 'findings') {
      this.finds.push(this.selectedFinding);
      this.selectedFinding = undefined;
      this.findingsForm.patchValue({ finding: '' });
      console.log('finds', this.finds);
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
    if (type === 'therapy') {
      this.theraps = this.theraps.filter((value) => value !== el);
    }
    if (type === 'findings') {
      this.finds = this.finds.filter((value) => value !== el);
    }
  }

  private _filter(name: string) {
    const filterValue = name.toLowerCase();
    return this.medications.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private fetchMedications(): void {
    this.firebaseService.getScanDB(this.language, 'medication', this.pet.pet.species.value)
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
    this.firebaseService.getScanDB(this.language, 'diagnosis', this.pet.pet.species.value)
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

  public onSaveDocument(): void {}


  ionViewWillLeave() {
    this.meds = undefined;
    this.diags = undefined;
    this.theraps = undefined;
    this.finds = undefined;

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

}
