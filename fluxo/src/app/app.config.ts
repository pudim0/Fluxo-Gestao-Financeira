import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import {
  APP_INITIALIZER,
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import {
  provideRouter,
  withInMemoryScrolling,
  withViewTransitions
} from '@angular/router';

import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';

import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';

import { authInterceptor } from './interceptors/auth.interptor';

import { MockTransactionRepository } from './repositories/mock-transaction.repository';
import { TRANSACTION_REPOSITORY } from './repositories/transaction.repository';

import { LanguageService } from './core/services/language.service';


registerLocaleData(localePt);


export function inicializarIdioma(
  languageService: LanguageService
): () => void {

  return () => {
    languageService.mudarIdioma(languageService.idioma());
  };

}


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

    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    {
      provide: TRANSACTION_REPOSITORY,
      useClass: MockTransactionRepository
    },

    {
      provide: LOCALE_ID,
      useValue: 'pt-BR'
    },

    provideTranslateService({

      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json',
      }),

      fallbackLang: 'pt-BR',

    }),

    {
      provide: APP_INITIALIZER,
      useFactory: inicializarIdioma,
      deps: [LanguageService],
      multi: true,
    },

  ],

};