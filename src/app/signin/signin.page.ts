import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../services/common.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  public logo = '../../assets/icons/logo_confid_2.svg';
  public signinForm: FormGroup;
  public errorMsg: any;

  constructor(
    private commonService: CommonService,
    public afAuth: AngularFireAuth,
    private translateService: TranslateService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.translateService.setDefaultLang(this.commonService.language); // fallback
    this.translateService.use(this.translateService.getBrowserLang());
    this.signinForm = new FormGroup({
      name: new FormControl(null, {
        updateOn: 'change',
        validators: [
          Validators.required
        ]
      }),
      password: new FormControl(null, {
        updateOn: 'change',
        validators: [
          Validators.required
        ]
      })
    });
  }

  public onLogin(): void {
   this.commonService.signInToBackend(
     this.signinForm.value.name, this.signinForm.value.password
   ).then(response => {
     if (response?.errors) {
       this.errorMsg = response.errors[0]?.title;
     } else {
       this.afAuth.signInWithCustomToken(response.customToken)
         .then(() => {
           this.router.navigateByUrl('/');
         });
     }
   });
  }
}
