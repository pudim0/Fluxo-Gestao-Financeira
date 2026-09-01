import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interptor';
import { MockTransactionRepository } from './repositories/mock-transaction.repository';
import { TRANSACTION_REPOSITORY } from './repositories/transaction.repository';
import { provideTranslateService } from '@ngx-translate/core';

import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'top',
      }),
      withViewTransitions(),
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: TRANSACTION_REPOSITORY, useClass: MockTransactionRepository },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json',
      }),
      fallbackLang: 'pt-BR',
    }),
  ],
};
