import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeKeycloak } from './keycloak-init';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(KeycloakAngularModule),
    provideAppInitializer(() => initializeKeycloak(inject(KeycloakService))),
    provideRouter(routes),
    provideAnimationsAsync()
  ]
};
