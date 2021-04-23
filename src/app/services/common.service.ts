import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public get language(): string {
    const browserLanguage = this.translateService.getBrowserLang();
    if (browserLanguage === 'de' || browserLanguage === 'dk' || browserLanguage === 'fr') {
      return browserLanguage;
    }
    return 'de';
  }

  constructor(
    private translateService: TranslateService
  ) {
    this.translateService.setDefaultLang(this.language); // fallback
    this.translateService.use(this.translateService.getBrowserLang());
  }
}
