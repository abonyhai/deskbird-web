import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import { provideTransloco } from '@ngneat/transloco';
import { TranslocoHttpLoader } from './transloco.loader';
import { provideHttpClient } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpRequestInterceptor } from './shared/interceptors/http.interceptor';
import { UsersEffects, usersReducer } from './store/users';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideStore({ users: usersReducer }),
    provideEffects([UsersEffects]),
    provideHttpClient(),
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
    providePrimeNG({
      theme: {
        preset: Lara,
        options: {
          // todo check why color not changing
          colorScheme: 'blue',
        },
      },
    }),
    provideTransloco({
      config: {
        availableLangs: ['en'],
        defaultLang: 'en',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
      },
      loader: TranslocoHttpLoader,
    }),
    provideAnimations(),
  ],
};
