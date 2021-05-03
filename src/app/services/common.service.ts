import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public user$: Observable<any | null>;
  public get language(): string {
    const browserLanguage = this.translateService.getBrowserLang();
    if (browserLanguage === 'de' || browserLanguage === 'dk' || browserLanguage === 'fr') {
      return browserLanguage;
    }
    return 'de';
  }

  private baseUrl = environment.baseUrl;

  constructor(
    private translateService: TranslateService,
    public afAuth: AngularFireAuth,
    private http: HttpClient
  ) {
    this.user$ = this.afAuth.authState;
    this.translateService.setDefaultLang(this.language); // fallback
    this.translateService.use(this.translateService.getBrowserLang());
  }

  public signInToBackend(user: string, pw: string) {
    const headers = {
      'Content-Type': 'application/json'
    };
    const body = JSON.stringify({ username: user, password: pw });
    const url = `${this.baseUrl}/${this.language}/vet/login`;
    return fetch(url, { method: 'POST', headers, body })
      .then((resp) => {
        if (!resp.ok) {
          throw resp.json();
        }
        return resp.json();
      })
      .catch(e => e);
  }

  public logOut(): Promise<any> {
    return this.afAuth.signOut()
      .then(() => {
        localStorage.clear();
      });
  }

  public getCareCardContent(pet: string, user: string, token: string): Observable<any> {
    const baseUrl = environment.baseUrl;
    const url = `${baseUrl}/${this.language}/carecard`;
    const headers = {
      'Content-Type': 'application/json',
      'firebase-context-token': token,
    };
    const body = {
      petId: pet,
      uid: user
    };

    return this.http.post(url, body, { headers });
  }

  public getSecureLink(
    path: string,
    dir: string,
    petId: string,
    uid: string,
    token: string
  ): Observable<any> {
    const url = `${this.baseUrl}/${this.language}/${dir}/get-url-from-path`;
    console.log('url', url);
    const headers = {
      'Content-Type': 'application/json',
      'firebase-context-token': token
    };
    const body = {
      path,
      petId,
      uid
    };
    return this.http.post(url, body, { headers });
  }

  public getCareCardlistContent(key: string, token: string, idPet, idUser): Observable<any> {
    const baseUrl = environment.baseUrl;
    const url = `${baseUrl}/${this.language}/carecard/${key}`;
    const headers = {
      'Content-Type': 'application/json',
      'firebase-context-token': token,
      'sw-context-token': ''
    };
    const body = {
      petId: idPet,
      uid: idUser
    };
    return this.http.post(url, body, { headers });
  }

  public getCareCardDetailContent(params: any, user: any): Observable<any> {
    const baseUrl = environment.baseUrl;
    const url = `${baseUrl}/${this.language}/carecard/${params.key}/${params.list}`;


    const headers = {
      'Content-Type': 'application/json',
      'firebase-context-token': user.za
    };
    const body = {
      petId: params.petId,
      uid: params.userId,
      venomKey: params.venom,
      level3Id: params.level3Id
    };
    return this.http.post(url, body, { headers });
  }

  public getVetFormContent(params: any, user: any): Observable<any> {
    const baseUrl = environment.baseUrl;
    const url = `${baseUrl}/${this.language}/vet/forms`;


    const headers = {
      'Content-Type': 'application/json',
      'firebase-context-token': user.za
    };
    const body = {
      petId: params.petId,
      uid: params.userId,
      venomKey: params.venom,
      appointmentId: params.appointmentId
    };
    return this.http.post(url, body, { headers });
  }
}
