import { KeycloakEventType, KeycloakService } from 'keycloak-angular';

export function initializeKeycloak (keycloak: KeycloakService) {
  keycloak.keycloakEvents$.subscribe({
    next(event) {
      if (event.type == KeycloakEventType.OnTokenExpired) {
        keycloak.updateToken(20);
      }
    },
  });

  return keycloak.init({
    config: {
      url: 'http://localhost:8069',
      realm: 'myrealm',
      clientId: 'myclient',
    },
    loadUserProfileAtStartUp: true,
    initOptions: {
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri:
        window.location.origin + '/assets/silent-check-sso.html',
      checkLoginIframe: false,
      redirectUri: 'http://localhost:4200/',
    },
    bearerExcludedUrls: ['/assets'],
  });
}