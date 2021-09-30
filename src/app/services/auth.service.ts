import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any | null>;
  private baseUrl = environment.baseUrl;
  private previousUrl: string;
  private currentUrl: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    public afAuth: AngularFireAuth,
  ) {
    this.user$ = this.afAuth.authState;
  }

  public logOut(): Promise<any> {
    return this.afAuth.signOut()
      .then(() => {
        localStorage.clear();
      });
  }
}
