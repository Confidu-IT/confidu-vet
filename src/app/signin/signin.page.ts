import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../services/common.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
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
  private baseUrl = environment.baseUrl;

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
   this.signInToBackend(
     this.signinForm.value.name, this.signinForm.value.password
   ).then(response => {
     if (response?.errors) {
       this.errorMsg = response.errors[0]?.title;
     } else {
      const token = response.customToken;
       localStorage.setItem('user_uid', token);
       this.afAuth.signInWithCustomToken(token)
         .then(() => {
           this.router.navigateByUrl('/');
         });
     }
   });
  }

  private signInToBackend(user: string, pw: string) {
    const headers = {
      'Content-Type': 'application/json'
    };
    const body = JSON.stringify({ username: user, password: pw });
    const url = `${this.baseUrl}/de/vet/login`;
    return fetch(url, { method: 'POST', headers, body })
      .then((resp) => {
        if (!resp.ok) {
          throw resp.json();
        }
        return resp.json();
      })
      .catch(e => e);
  }
}
