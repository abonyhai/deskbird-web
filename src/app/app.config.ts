import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import { provideTransloco } from '@ngneat/transloco';
import { TranslocoHttpLoader } from './transloco.loader';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpRequestInterceptor } from './shared/interceptors/http.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideStore(),
    provideEffects(),
    provideHttpClient(withInterceptors([HttpRequestInterceptor])),
    providePrimeNG({ theme: { preset: Lara } }),
    provideTransloco({
      config: {
        availableLangs: ['en'],
        defaultLang: 'en',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
