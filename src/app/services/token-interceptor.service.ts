import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {environment} from '../../environments/environment.prod';
import {CommonService} from './common.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {
  private baseUrl = environment.baseUrl;

  constructor(
    private commonService: CommonService,
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = request?.url;

    if (url.search('i18n') > -1) {
      return next.handle(request);
    }

    return this.commonService.afAuth.idToken.pipe(
      mergeMap((token: any) => {
        if (token && url.search(this.baseUrl) > -1) { // req to own backend
          request = request.clone({
            setHeaders: {'firebase-context-token': token}
          });
        }
        return next.handle(request);
      }));
  }
}
