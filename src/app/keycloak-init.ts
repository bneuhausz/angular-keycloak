import { KeycloakService } from 'keycloak-angular';
import { environment } from '../environments/environment.development';

export function initializeKeycloak (keycloak: KeycloakService) {
  return keycloak.init({
    config: {
      url: environment.keycloak.url,
      realm: environment.keycloak.realm,
      clientId: environment.keycloak.clientId,
    },
    loadUserProfileAtStartUp: true,
    initOptions: {
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri:
        window.location.origin + '/assets/silent-check-sso.html',
      checkLoginIframe: false,
      redirectUri: environment.keycloak.redirectUri,
    },
    bearerExcludedUrls: ['/assets'],
  });
}