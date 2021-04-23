import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any | null>;
  private baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    public afAuth: AngularFireAuth
  ) {
    this.user$ = this.afAuth.authState;
  }

  // public logOut(): void {
  //   this.router.navigateByUrl('/signin')
  //     .then(() => {
  //       this.afAuth.auth.signOut()
  //         .then(() => {
  //           // localStorage.clear();
  //         });
  //     });
  // }

  // private createToken(id: string) {
  //   const body = new FormData();
  //   const url = `${this.baseUrl}/postmethod_custom_token`;
  //   body.append('shopwareId', id);
  //   body.append('shopwareToken', localStorage.getItem('sw-token'));
  //   body.append('SECRET_KEY', '12345');
  //   return fetch(url, { method: 'POST', body })
  //     .then(resp => resp.json())
  //     .then(data => data);
  // }

  // public async createOrGetFirebaseUser(obj: any) {
  //   let token = await this.createToken(obj.id);
  //   token = token.customToken;
  //   localStorage.setItem('user_uid', token);
  //   await this.afAuth.auth.signInWithCustomToken(token);
  // }
}
