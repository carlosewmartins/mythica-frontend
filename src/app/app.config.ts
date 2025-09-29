import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { provideHttpClient } from '@angular/common/http';
import MeuTema from '../styles/mythica';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    MessageService,
    providePrimeNG({
      theme: {
        options: {
          darkModeSelector: '.mythica-dark',
          prefix: 'my',
          cssLayer: {
            name: 'primeng',
            order: 'base, primeng, components, utilities, app'
          }
        },
        preset: MeuTema
      }

    })
  ]
};


